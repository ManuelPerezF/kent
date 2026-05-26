import { z } from "zod";
import { Prisma } from "../../../prisma/client/client.js";

export const registerBodySchema = z.object({
  username: z.string().trim().min(3, "El usuario debe tener al menos 3 caracteres"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export const loginBodySchema = z.object({
  username: z.string().trim().min(1, "El usuario es obligatorio"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

export type RegisterBody = z.infer<typeof registerBodySchema>;
export type LoginBody = z.infer<typeof loginBodySchema>;

export const userSelectPublic = { id: true, username: true, createdAt: true } as const;
export const userSelectWithHash = { ...userSelectPublic, passwordHash: true } as const;

export type PublicUser = Prisma.UserGetPayload<{ select: typeof userSelectPublic }>;
export type UserWithHash = Prisma.UserGetPayload<{ select: typeof userSelectWithHash }>;
