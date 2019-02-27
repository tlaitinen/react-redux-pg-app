import * as saga from './saga';
import * as state from './state';
import {create as createActions} from './actions';


import configureMockStore from 'redux-mock-store';
import createSagaMiddleware from 'redux-saga';
import {select, put, call} from 'redux-saga/effects';

interface DummyIn {
  name: string;
}
interface Dummy extends DummyIn {
  id: string;
}

interface Query {
  ids?: string[];
  offset?: number;
  limit?: number;
}
const withoutOffsetLimit = (query:Query) => ({
  ...query,
  offset: undefined,
  limit: undefined
});
type DummyState = state.State<Dummy, DummyIn, Query>;

interface RootState {
  dummy: DummyState;
}

async function fetchFunc1(_query:Query):Promise<Dummy[]> {
  return [{id:'1',name:'dummy1'},{id:'2',name:'dummy2'}];
}
async function fetchFunc2(_query:Query):Promise<Dummy[]> {
  throw new Error('fetch failed');
}
async function putFunc(dummyId:string, dummy:DummyIn):Promise<Dummy> {
	return {
		id: dummyId,
		...dummy,
		name: 'modified1'
	};
}
async function putFuncFail():Promise<Dummy> {
  throw new Error('put failed');
}
async function postFunc1(dummy:DummyIn):Promise<Dummy> {
  return {
    id: '1',
    ...dummy
  };
}

async function postFunc2(_dummy:DummyIn):Promise<Dummy> {
  return {
    id: '1',
    name: 'modified2'
  };
}
async function postFunc3(_dummy:DummyIn):Promise<Dummy> {
  throw new Error('post failed');
}
const getId = (d:Dummy) => d.id;
const getState = (state:RootState) => state.dummy;
const entitiesQuery = (ids:string[]) => ({ids});
const crudId = 'dummy';

const actions = createActions<Dummy, DummyIn, Query>(crudId);
const sagas1 = saga.create<Dummy, DummyIn, Query, RootState>({
  crudId,
  getId,
  getState,
  entitiesQuery,
  withoutOffsetLimit,
  api: {
    select: fetchFunc1,
    update: putFunc,
    insert: postFunc1
  },
  actions
});

const sagas2 = saga.create<Dummy, DummyIn, Query, RootState>({
  crudId,
  getId,
  getState,
  entitiesQuery,
  withoutOffsetLimit,
  api: {
    select: fetchFunc2,
    update: putFunc,
    insert: postFunc2
  },
  actions
});

const sagas3 = saga.create<Dummy, DummyIn, Query, RootState>({
  crudId,
  getId,
  getState,
  entitiesQuery,
  withoutOffsetLimit,
  api: {
    select: fetchFunc1,
    update: putFuncFail,
    insert: postFunc3
  },
  actions
});



const defRootState:RootState = {
  dummy: state.createDefState<Dummy, DummyIn, Query>()
};
const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];
const mockStore = configureMockStore(middlewares);
describe('frontend:crud:actions', () => {
  it('should create correct actions when fetchFunc succeeds', async () => {
    
    const gen = sagas1.fetchResults(actions.fetchResults('query1', {offset:3}));
    expect(gen.next().value).toEqual(select(getState));
    expect(gen.next(getState(defRootState)).value).toEqual(put(actions.setResults('query1', {
      results: [],
      loading: true
    })));
    expect(gen.next().value).toEqual(put(actions.setQuery('query1', {
      offset: 3
    })));
    expect(gen.next().value).toEqual(call(fetchFunc1, {offset:3}));
    const r = await fetchFunc1({offset:3});
    expect(gen.next(r).value).toEqual(put(actions.setEntities({
      '1': {
        id: '1',
        name: 'dummy1'
      },
      '2': {
        id: '2',
        name: 'dummy2'
      }
    })));
    expect(gen.next().value).toEqual(put(actions.setResults('query1', {
      results: ['1','2'],
      loading: false
    })));
  });
  it('it should create correct actions and an exception when fetchFunc fails', async () => {
    const store = mockStore(defRootState);
    await sagaMiddleware.run(() => sagas2.fetchResults(actions.fetchResults('query1', {offset:3})));
    expect(store.getActions()).toEqual([
      actions.setResults('query1', {
        results: [],
        loading: true
      }),
      actions.setQuery('query1', {
        offset: 3
      }),
      actions.setResults('query1', {
        results: [],
        loading: false,
        error: 'fetch failed'
      })
    ]);
  });

  it('should create setStatus and setEntities actions when put succeeds and returns entity', async () => {
    const d:Dummy = {
      id: '1',
      name: 'to overwrite'
    };
    const gen = sagas1.putEntity(actions.putEntity('1', d));
    expect(gen.next().value).toEqual(put(actions.setEntities({'1': d})));
    expect(gen.next().value).toEqual(put(actions.setStatus('1', {busy:true})));
    expect(gen.next().value).toEqual(call(putFunc, '1', d));
    await putFunc('1', d);

    expect(gen.next().value).toEqual(put(actions.setStatus('1', {busy:false})));
  });
  it('should create setStatus actions and throw exception when put fails', async () => {
    const store = mockStore(defRootState);
    await sagaMiddleware.run(() => sagas3.putEntity(actions.putEntity('1', {
      id: '1',
      name: 'dummy1'
    })));
    
    expect(store.getActions()).toEqual([
      actions.setEntities({
        '1': {
          id: '1',
          name: 'dummy1'
        }
      }),
      actions.setStatus('1', {busy:true}),
      actions.setStatus('1', {busy:false, error: 'put failed'})
    ]);
  });
  it('should create setEntities action when post succeeds and returns an entity', async () => {
    const d:Dummy = {
      id: '',
      name: 'dummy'
    };
    const gen = sagas2.postEntity(actions.postEntity(d));
    expect(gen.next().value).toEqual(select(getState));
    expect(gen.next(getState(defRootState)).value).toEqual(put(actions.setPostStatus({busy:true})));
    expect(gen.next().value).toEqual(call(postFunc2, d));
    const r = await postFunc2(d);
    expect(gen.next(r).value).toEqual(put(actions.setEntities({[getId(r)]:r})));
    expect(gen.next().value).toEqual(put(actions.setPostStatus({
      busy:false,
      entity: r
    })));
  });
  it('should set post result to error when post fails', async () => {
    const store = mockStore(defRootState);
     
    await sagaMiddleware.run(() => sagas3.postEntity(actions.postEntity({
      name: 'dummy'
    })));
    expect(store.getActions()).toEqual([
      actions.setPostStatus({
        busy: true
      }),
      actions.setPostStatus({
        error:'post failed',
        entityIn: {
          name: 'dummy'
        },
        busy: false
      })
    ]);
  });
});
