import {actions, reducer, Action} from './locale';
jest.mock('../locale/fi/LC_MESSAGES/messages.po', () => {
  return jest.fn(() => ({}));
})
jest.mock('../locale/en/LC_MESSAGES/messages.po', () => {
  return jest.fn(() => ({}));
})

describe('frontend:locale:reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, <Action> {})).toEqual('en');
  });
  it('should handle LOCALE_CHANGE_LANGUAGE', () => {
    expect(reducer(undefined, actions.setLanguage('fi'))).toEqual('fi');
  });
});
