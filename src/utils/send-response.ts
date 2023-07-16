export const sendResponse = (status: number, message: string, data?: any) => {
  return { status, message, data };
};
