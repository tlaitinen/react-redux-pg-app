import {createStandardAction, ActionType, getType} from 'typesafe-actions';
import * as reducer from './reducer';
import * as state from './state';
import {Action, create as createActions} from './actions';

interface DummyIn {
  name: string;
}
interface Dummy extends DummyIn {
  id: string;
}

interface Query {
  ids?:string[];
  offset?: number;
}
type DummyState = state.State<Dummy, DummyIn, Query>;
type DummyAction = Action<Dummy, DummyIn, Query>;

interface RootState {
  dummy: DummyState;
}
const hydrateAction = createStandardAction('HYDRATE')<RootState>();
type HydrateAction = ActionType<typeof hydrateAction>;
const getId = (d:Dummy) => d.id;
const getState = (state:RootState) => state.dummy;

const crudId = 'dummy';
const actions = createActions<Dummy, DummyIn, Query>(crudId);

const defRootState:RootState = {
  dummy: state.createDefState<Dummy, DummyIn, Query>()
};
function isHydrateAction(action:any):action is HydrateAction {
  return typeof action === 'object' && action.type === getType(hydrateAction);
}
describe('frontend:crud:reducer', () => {
  const r = reducer.createReducer<Dummy, DummyIn, Query, HydrateAction>(
    crudId,
    isHydrateAction,
    (ha:HydrateAction) => ha.payload.dummy
  );
  const defState = defRootState.dummy;
  it('should return the initial state', () => {
    expect(r(undefined, <DummyAction> {})).toEqual({
      queries: {},
      results: {},
      entities: {},
      entityStatus: {},
      selected: {},
      allSelected: {},
      entitiesIn: {},
      postStatus: {}
    });
  });
  it('should handle CRUD_SET_QUERY', () => {
    expect(r(defState, actions.setQuery('query1', {offset: 3}))).toEqual({
      ...defState,
      queries: {
        query1: {
          offset: 3
        }
      }
    });
  });

  it('should handle CRUD_SET_RESULTS', () => {
    expect(r(defState, actions.setResults('query1', {
      results: ['1', '2'],
      loading: false
    }))).toEqual({
      ...defState,
      results: {
        query1: {
          results: ['1', '2'],
          loading: false
        }
      }
    });
  });
  it('should handle CRUD_SET_ENTITIES', () => {
    expect(r(
      {
        ...defState,
        entities: {
          '1': {
            id: '1',
            name: 'old dummy1'
          },
          '3': {
            id: '3',
            name: 'dummy3'
          }
        }
      }, actions.setEntities({
        '1': {
          id: '1',
          name: 'dummy1'
        },
        '2': {
          id: '2',
          name: 'dummy2'
        }
      })
    )).toEqual({
      ...defState,
      entities: {
        '1': {
          id: '1',
          name: 'dummy1'
        },
        '2': {
          id: '2',
          name: 'dummy2'
        },
        '3': {
          id: '3',
          name: 'dummy3'
        }
      }
    });
  });
  it('should handle CRUD_SET_STATUS', () => {
    expect(r(
      {
        ...defState,
        entityStatus: {
          '1': {busy:true},
          '3': {busy:false}
        }
      }, actions.setStatus('3', {busy:true})
    )).toEqual({
      ...defState,
      entityStatus: {
        '1': {busy:true},
        '3': {busy:true}
      }
    });
  });
});

describe('frontend:crud:selectors', () => {
  const selectors = reducer.createSelectors<Dummy, DummyIn, Query, RootState>(
    getState,
    getId
  );
  const testState:RootState = {
    dummy: {
      queries: {
        query1: {
          offset: 3
        }
      },
      results: {
        query1: {
          results: ['1', '2'],
          loading: false
        }
      },
      entities: {
        '1': {
          id: '1',
          name: 'dummy1'
        },
        '2': {
          id: '2',
          name: 'dummy2'
        }
      },
      entityStatus: {
        '1': {busy:true},
        '2': {busy:false}
      },
      selected: {},
      allSelected: {},
      entitiesIn: {},
      postStatus: {
        query1: {
          busy: false
        }
      }
    }
  };

  it('should select query', () => {
    expect(selectors.query(testState, 'query1')).toEqual({
      offset: 3
    });
  });
  it('should select results', () => {
    expect(selectors.results(testState, 'query1')).toEqual({
      results: ['1', '2'],
      loading: false
    });
  });
  it('should select entity status', () => {
    expect(selectors.entityStatus(testState, '1')).toEqual(
     {busy:true}
    );
  });
});
