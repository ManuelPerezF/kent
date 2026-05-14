import type { NextFunction, Request, Response } from "express";
import { ForbiddenError, UnauthorizedError } from "../errors/appError.js";
import { verifyAccessToken, type TokenPayload } from "../utils/jwt.js";

/** Request extendido con el usuario autenticado. */
export type AuthenticatedRequest = Request & { user: TokenPayload };

/**
 * Verifica que la petición incluya un JWT válido en el header Authorization.
 */
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Token no proporcionado o formato inválido."));
  }

  const token = authHeader.slice(7);

  try {
    const payload = verifyAccessToken(token);
    (req as AuthenticatedRequest).user = payload;
    next();
  } catch {
    return next(new UnauthorizedError("Token inválido o expirado."));
  }
};

