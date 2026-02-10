import { Router } from "express";
import { CategoriesControllers } from "./categories.controller";
import { auth } from "../../middleware/auth";
import { UserRoles } from "../../../generated/prisma/enums";

const router = Router();

// get all categories  (public)
router.get("/", CategoriesControllers.getAllCategories);

// add a category (admin)
router.post("/", auth(UserRoles.admin), CategoriesControllers.addCategory);

// update a category (admin)
router.patch(
  "/:id",
  auth(UserRoles.admin),
  CategoriesControllers.updateCategory,
);

// delete a category (admin)
router.delete(
  "/:id",
  auth(UserRoles.admin),
  CategoriesControllers.deleteCategory,
);

export { router as CategoriesRoutes };
