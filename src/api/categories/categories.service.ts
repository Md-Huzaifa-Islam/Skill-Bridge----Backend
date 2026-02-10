import { prisma } from "../../lib/prisma";
// only get
const getAllCategories = async () => {
  return await prisma.category.findMany();
};

//post
const addCategory = async (name: string) => {
  return await prisma.category.create({
    data: {
      name,
    },
  });
};

//patch with /:id
const updateCategory = async (name: string, id: string) => {
  return await prisma.category.update({
    data: {
      name,
    },
    where: {
      id,
    },
  });
};

// delete with /:id
const deleteCategory = async (id: string) => {
  return await prisma.category.delete({
    where: {
      id,
    },
  });
};

const getCategoryByName = async (name: string) => {
  return await prisma.category.findFirst({
    where: {
      name: {
        equals: name,
        mode: "insensitive",
      },
    },
  });
};

export const CategoriesServices = {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  getCategoryByName,
};
