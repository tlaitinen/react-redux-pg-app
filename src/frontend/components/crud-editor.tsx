import React from 'react';
import {
  typedConnect,
  createPropsMapper,
  PropsOf
} from 'react-redux-typed-connect';
import {withRouter, RouteComponentProps} from 'react-router-dom';
import {Button, ButtonToolbar} from 'react-bootstrap';
import Spinner from './spinner';
import ErrorMessage from './error-message';
import {Actions, Selectors, EntityStatus} from '../actions/crud';
export interface CreateCrudEditor<E,Q,RS,EI> {
  selectors: Selectors<E,EI,Q,RS>;
  actions: Actions<E,EI,Q>;
}
export interface EditorProps<E,EI> {
  entity?: E;
  entityStatus: EntityStatus,
  entityIn?: EI;
  update: (updates:Partial<EI>) => void;
  renderEntityStatus: () => React.ReactElement<any> | null;
  renderInsertButton: (text:string) => React.ReactElement<any> | null;
}
export function createCrudEditor<E,Q,RS,EI>(options:CreateCrudEditor<E,Q,RS,EI>) {
  type Props = PropsOf<typeof propsMapper> & RouteComponentProps<{}>;
  class CrudEditor extends React.Component<Props> {
    componentDidMount() {
      if (!this.props.entityIn) {
        const entityIn = this.props.defaultEntityIn();
        if (entityIn) {
          this.props.setEntityIn(entityIn);
        }
      }
    }
    componentWillReceiveProps(np:Props) {
      if (!np.entityIn) {
        const entityIn = np.defaultEntityIn();
        if (entityIn) {
          np.setEntityIn(entityIn);
        }
      }
    }
    render() {
      const {
        entity, entityIn, entityStatus, render, setEntityIn, putEntityLater,
        postEntity, defaultEntityIn, postStatus, isValid, editorId
      } = this.props;
      const valid = entity ? isValid(entity) : entityIn ? isValid(entityIn) : undefined;
      function update(updates:Partial<EI>) {
        if (entity) {

          putEntityLater(options.selectors.entityId(entity), Object.assign({} as Partial<E>, entity, updates));
        } else if (entityIn) {
          setEntityIn(Object.assign({}, entityIn, updates));
        }
      }
      function renderEntityStatus() {
        if (!entity) {
          return null;
        }
        if (entityStatus.busy) {
          return <Spinner/>;
        } 
        if (entityStatus.error) {
          return <ErrorMessage>{entityStatus.error}</ErrorMessage>;
        }
        if (postStatus && postStatus.error) {
          return <ErrorMessage>{postStatus.error}</ErrorMessage>;
        }
        return null;
      }
      const renderInsertButton = (text:React.ReactNode | string) => (
        entity 
          ? null
          : <React.Fragment>
            <ButtonToolbar>
              <Button disabled={postStatus && postStatus.busy || !entityIn || !valid} 
                  bsStyle='primary' onClick={() => {
                if (entityIn) {
                  postEntity(entityIn, editorId);
                  const newEntityIn = defaultEntityIn();
                  if (newEntityIn) {
                    setEntityIn(newEntityIn);
                  }
                }
              }}>
                {text}
              </Button>
            </ButtonToolbar>
            {postStatus && postStatus.error 
              ? <ErrorMessage>
                  {postStatus.error}
                </ErrorMessage>
              : null}
          </React.Fragment>
      );
      return render({
        entity,
        entityIn,
        entityStatus,
        update,
        renderEntityStatus,
        renderInsertButton
      });
    }
  };
  const propsMapper = createPropsMapper({
    fromState: (state:RS, ownProps:{
      editorId?:string;
      entityId?:string;
      defaultEntityIn: () => EI | undefined;
      isValid:(entity:E | EI) => boolean | undefined;
      render:(props:EditorProps<E,EI>) => React.ReactElement<any> | null;
    }) => {
      return {
        entity: ownProps.entityId 
          ? options.selectors.entity(state, ownProps.entityId) : undefined,
        entityIn: options.selectors.entityIn(state, ownProps.editorId),
        entityStatus: options.selectors.entityStatus(state, ownProps.entityId),
        postStatus: options.selectors.postStatus(state, ownProps.editorId),
      };
    },
    actions: (ownProps) => ({
      postEntity: options.actions.postEntity,
      setEntityIn: (entityIn:EI) => options.actions.setEntityIn(entityIn, ownProps.editorId),
      putEntityLater: options.actions.putEntityLater
    })
  });
  return withRouter(typedConnect(propsMapper)(CrudEditor));
}
