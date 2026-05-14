import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError, ValidationError } from "../errors/appError.js";

export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (error instanceof ZodError) {
    const validationError = new ValidationError("Payload invalido.", error.flatten());
    res.status(validationError.statusCode).json({
      message: validationError.message,
      code: validationError.code,
      details: validationError.details,
    });
    return;
  }

  if (error instanceof AppError) {
    const err = error;
    res.status(err.statusCode).json({
      message: err.message,
      code: err.code,
      ...(err.details !== undefined ? { details: err.details } : {}),
    });
    return;
  }

  console.error("Unhandled error:", error);
  res.status(500).json({
    message: "Error interno del servidor.",
    code: "INTERNAL_SERVER_ERROR",
  });
};
