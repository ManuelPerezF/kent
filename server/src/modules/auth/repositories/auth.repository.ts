import { Prisma } from "../../../prisma/client/client.js";
import { prisma } from "../../../shared/db/prisma.js";

const SELECT_PUBLIC = { id: true, username: true, createdAt: true } as const;
const SELECT_WITH_HASH = { ...SELECT_PUBLIC, passwordHash: true } as const;

// Prisma genera estos tipos automáticamente según lo que seleccionamos
export type PublicUser = Prisma.UserGetPayload<{ select: typeof SELECT_PUBLIC }>;
export type UserWithHash = Prisma.UserGetPayload<{ select: typeof SELECT_WITH_HASH }>;

/** Queries de usuario en la base de datos. Sin lógica de negocio. */
export const authRepository = {
  async findByUsername(username: string): Promise<UserWithHash | null> {
    return prisma.user.findUnique({
      where: { username },
      select: SELECT_WITH_HASH,
    });
  },

  async createUser(username: string, passwordHash: string): Promise<PublicUser> {
    return prisma.user.create({
      data: { username, passwordHash },
      select: SELECT_PUBLIC,
    });
  },
};
