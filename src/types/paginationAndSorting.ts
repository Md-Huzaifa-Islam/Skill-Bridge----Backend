export type PaginationParams = {
  page?: string;
  limit?: string;
};

export enum SortBy {
  createdAt = "createdAt",
  updatedAt = "updatedAt",
  day = "day",
  price_per_hour = "price_per_hour",
  name = "name",
  email = "email",
  date = "date",
  start_time = "start_time",
}

export enum SortOrder {
  asc = "asc",
  desc = "desc",
}

export type SortingParams = {
  sortBy?: SortBy;
  sortOrder?: SortOrder;
};
