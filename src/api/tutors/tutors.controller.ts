import { NextFunction, Request, Response } from "express";
import { paginationHandler } from "../../handlers/paginationHandler";
import { sortingHander } from "../../handlers/sortingHandler";
import { SortBy, SortOrder } from "../../types/paginationAndSorting";
import { isEnumValue } from "../../handlers/enumValidateHandler";
import { TutorsServices } from "./tutors.service";
import { appError } from "../../types/appError";

const getAllTutors = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { search, sortby, sortorder, category, isFeatured, page, limit } =
      req.query;

    const { skip, take } = paginationHandler({
      page: typeof page === "string" ? page : undefined,
      limit: typeof limit === "string" ? limit : undefined,
    });

    const { sortBy, sortOrder } = sortingHander({
      sortBy:
        typeof sortby === "string" && isEnumValue(SortBy, sortby)
          ? sortby
          : undefined,

      sortOrder:
        typeof sortorder === "string" && isEnumValue(SortOrder, sortorder)
          ? sortorder
          : undefined,
    });

    const result = await TutorsServices.getAllTutors({
      search: typeof search == "string" ? search : undefined,
      sortBy,
      sortOrder,
      category: typeof category == "string" ? category : undefined,
      isFeatured:
        isFeatured === "true"
          ? true
          : isFeatured === "false"
            ? false
            : undefined,
      skip,
      take,
    });

    res.status(200).json({
      success: true,
      message: "Tutor data fetched successfully",
      data: result.tutors,
      pagination: {
        total_page: Math.ceil(result.total / take),
        limit: take,
        page: skip / take + 1,
      },
    });
  } catch (error: any) {
    next(error);
  }
};

const getATutor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const tutorId = typeof id === "string" ? id : id[0];
    const result = await TutorsServices.getATutor(tutorId);
    if (!result?.id) {
      const error = new Error("Tutor not found") as appError;
      error.status = 404;
      return next(error);
    }
    res.status(200).json({
      success: true,
      message: "Tutor infomation fetched successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const TutorsControllers = {
  getAllTutors,
  getATutor,
};
