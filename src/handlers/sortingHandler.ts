import {
  SortBy,
  SortingParams,
  SortOrder,
} from "../types/paginationAndSorting";

export const sortingHander = ({ sortBy, sortOrder }: SortingParams) => {
  let modifiedSortBy, modifiedSortOrder;

  if (!sortBy) {
    modifiedSortBy = SortBy.createdAt;
  } else {
    modifiedSortBy = sortBy;
  }
  if (!sortOrder) {
    modifiedSortOrder = SortOrder.desc;
  } else {
    modifiedSortOrder = sortOrder;
  }

  return {
    sortBy: modifiedSortBy,
    sortOrder: modifiedSortOrder,
  };
};
