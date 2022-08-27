
export const mockConsole = () => {
  const consoleErrorMocked = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  const consoleWarnMocked = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  return {
    consoleErrorMocked,
    consoleWarnMocked, 
  };
};
