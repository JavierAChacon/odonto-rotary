import { readRequiredEnvironmentVariable } from './app.helper.js';

describe('readRequiredEnvironmentVariable', () => {
  it('returns the value of an existing variable', () => {
    process.env.ODONTO_TEST_VARIABLE = 'configured-value';

    expect(readRequiredEnvironmentVariable('ODONTO_TEST_VARIABLE')).toBe(
      'configured-value',
    );
  });

  it('throws an error naming the variable when it is missing', () => {
    delete process.env.ODONTO_TEST_VARIABLE;

    expect(() =>
      readRequiredEnvironmentVariable('ODONTO_TEST_VARIABLE'),
    ).toThrow('Missing required environment variable: ODONTO_TEST_VARIABLE');
  });
});
