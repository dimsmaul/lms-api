export const OneResponse = <T>(data: T, message?: string) => {
  return {
    message: message || 'Success',
    data,
  };
};

export type OneResponseType<T> = {
  message: string;
  data: T;
};
