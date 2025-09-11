export const ListResponse = <T>(
  data: T[],
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  },
  message?: string,
) => {
  return {
    message: message || 'Success',
    data: {
      items: data,
      meta,
    },
  };
};

export type ListResponseType<T> = {
  data: T[];
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
