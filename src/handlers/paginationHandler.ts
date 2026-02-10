import { PaginationParams } from "../types/paginationAndSorting";

export const paginationHandler = ({ page, limit }: PaginationParams) => {
  let modifiedPage, modifiedLimit;

  if (!page || Number.isNaN(Number(page)) || Number(page) < 0) {
    modifiedPage = 1;
  } else {
    modifiedPage = Number(page);
  }

  if (!limit || Number.isNaN(Number(limit)) || Number(limit) < 0) {
    modifiedLimit = 9;
  } else {
    modifiedLimit = Number(limit);
  }

  const take = modifiedLimit;
  const skip = (modifiedPage - 1) * take;

  return { take, skip };
};
