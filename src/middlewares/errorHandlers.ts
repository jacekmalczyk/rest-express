import {Request, Response} from "express";
import {CustomError} from "../models/error";

export const errorResponder = (
  err: TypeError | CustomError,
  req: Request,
  res: Response
) => {
  let customError = err;
  console.log(err);

  if (!(err instanceof CustomError)) {
    customError = new CustomError("Something went wrong");
  }

  res.header("Content-Type", "application/json");
  res.status((customError as CustomError).status).send(customError);
};
