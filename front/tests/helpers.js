/* eslint import/prefer-default-export: 0 */

export const createFakeEvent = (params = {}) => ({
  preventDefault: jest.fn(),
  ...params,
});
