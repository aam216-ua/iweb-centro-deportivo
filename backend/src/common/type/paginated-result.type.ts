export type PaginatedResult<T> = {
  meta: {
    page: number;
    size: number;
    total: number;
  };
  data: T[];
};
