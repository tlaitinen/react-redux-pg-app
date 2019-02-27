import {Action, actions, defState, reducer} from './ui';

describe('frontend:ui:reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, <Action> {})).toEqual(defState);
  });
  it('should handle UI_SET_LOADING', () => {
    expect(reducer(undefined, actions.setLoading(true))).toEqual({
      ...defState,
      loading: 1
    });
  });
});
