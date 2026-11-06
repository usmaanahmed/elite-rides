// Request body ko Zod schema se check karta hai. Sahi ho to aage jaata hai, warna 400 error
import { NextFunction, Request, Response } from "express";
import path from "path";
import { ZodType } from "zod";
import { deleteFile } from "../utils/deleteFile.js";
import { AppError } from "../utils/AppError.js";

export function validate(schema: ZodType) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const result = schema.safeParse(req.body);

    if (result.success) {
      // Zod ne text ko numbers me bhi badal diya hai, wahi aage bhejo
      req.body = result.data;
      next();
      return;
    }

    // Body galat hai: upload ho chuki image ko delete karo, warna disk par bekaar padi rahegi
    if (req.file) {
      await deleteFile(path.resolve(req.file.path));
    }

    const firstIssue = result.error.issues[0];
    const fieldName = firstIssue.path.join(".");
    const message = fieldName ? fieldName + ": " + firstIssue.message : firstIssue.message;
    next(new AppError(message, 400));
  };
}
