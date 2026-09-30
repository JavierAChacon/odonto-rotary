export function readRequiredEnvironmentVariable(variableName: string): string {
  const variableValue = process.env[variableName];

  if (!variableValue) {
    throw new Error(`Missing required environment variable: ${variableName}`);
  }

  return variableValue;
}
