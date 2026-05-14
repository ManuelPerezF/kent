import bcrypt from "bcrypt";
import {
  ConflictError,
  InternalServerError,
  isPrismaUniqueViolation,
  UnauthorizedError,
} from "../../../shared/errors/appError.js";
import { createAccessToken } from "../../../shared/utils/jwt.js";
import { authRepository, type PublicUser } from "../repositories/auth.repository.js";
import type { LoginBody, RegisterBody } from "../schemas/auth.schema.js";

const SALT_ROUNDS = 10;

export interface AuthResponse {
  user: PublicUser;
  token: string;
}

/** Lógica de negocio: hashea contraseñas, genera tokens y lanza errores de dominio. */
export const authService = {
  async register(data: RegisterBody): Promise<AuthResponse> {
    try {
      const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
      const user = await authRepository.createUser(data.username, passwordHash);
      const token = createAccessToken({ sub: user.id, username: user.username });
      return { user, token };
    } catch (error) {
      if (isPrismaUniqueViolation(error)) {
        throw new ConflictError("Ese nombre de usuario ya está en uso");
      }
      throw new InternalServerError("No se pudo crear la cuenta");
    }
  },

  async login(data: LoginBody): Promise<AuthResponse> {
    const row = await authRepository.findByUsername(data.username);

    if (!row) {
      throw new UnauthorizedError("Usuario o contraseña incorrectos.");
    }

    const passwordOk = await bcrypt.compare(data.password, row.passwordHash);
    if (!passwordOk) {
      throw new UnauthorizedError("Usuario o contraseña incorrectos.");
    }

    const { passwordHash: _, ...user } = row;
    const token = createAccessToken({ sub: user.id, username: user.username });
    return { user, token };
  },
};
