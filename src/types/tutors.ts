import { SortBy, SortOrder } from "./paginationAndSorting";

export type getAllTutorsParams = {
  search?: string;
  sortBy: SortBy;
  sortOrder: SortOrder;
  category?: string;
  isFeatured?: boolean;
  skip: number;
  take: number;
};
