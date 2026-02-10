import { NextFunction, Request, Response } from "express";
import { appError } from "../../types/appError";
import { CategoriesServices } from "./categories.service";
// only get
const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await CategoriesServices.getAllCategories();
    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

//post
const addCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const name = req.body.name?.trim();
    if (!name) {
      const error = new Error("Category name is required") as appError;
      error.status = 400;
      return next(error);
    }

    const check = await CategoriesServices.getCategoryByName(name);
    if (check?.id) {
      return res.status(409).json({
        success: false,
        message: "Category with same name already exists.",
      });
    }
    const result = await CategoriesServices.addCategory(name);
    res.status(201).json({
      success: true,
      message: "Category created succeefully",
    });
  } catch (error: any) {
    next(error);
  }
};

//patch with /:id
const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const name = req.body.name?.trim();
    const { id: paramsId } = req.params;
    const id = typeof paramsId === "string" ? paramsId : paramsId[0];
    if (!name) {
      const error = new Error("Category name is required") as appError;
      error.status = 400;
      return next(error);
    }
    if (!id) {
      const error = new Error("Category id is required") as appError;
      error.status = 400;
      return next(error);
    }

    const check = await CategoriesServices.getCategoryByName(name);
    if (check?.id && check.id != id) {
      return res.status(409).json({
        success: false,
        message: "Category with same name already exists.",
      });
    }
    const result = await CategoriesServices.updateCategory(name, id);
    res.status(200).json({
      success: true,
      message: "Category updated succeefully",
    });
  } catch (error: any) {
    next(error);
  }
};

// delete with /:id
const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: paramsId } = req.params;
    const id = typeof paramsId === "string" ? paramsId : paramsId[0];
    if (!id) {
      const error = new Error("Category id is required") as appError;
      error.status = 400;
      return next(error);
    }

    const result = await CategoriesServices.deleteCategory(id);
    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (err: any) {
    if (err.code == "P2025") {
      const error = new Error("Category id is not found") as appError;
      error.status = 404;
      return next(error);
    }
    next(err);
  }
};

export const CategoriesControllers = {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
};
