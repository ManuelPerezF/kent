import { z } from "zod";

export const registerBodySchema = z.object({
  username: z.string().trim().min(3, "El usuario debe tener al menos 3 caracteres"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export const loginBodySchema = z.object({
  username: z.string().trim().min(1, "El usuario es obligatorio"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

// Tipos inferidos directamente de los schemas (no necesitamos definirlos a mano)
export type RegisterBody = z.infer<typeof registerBodySchema>;
export type LoginBody = z.infer<typeof loginBodySchema>;
