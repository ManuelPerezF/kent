import jwt from "jsonwebtoken";

export interface TokenPayload {
  sub: number;
  username: string;
}

const SECRET = process.env.JWT_SECRET!;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN!;

export const createAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN } as jwt.SignOptions);
};

export const verifyAccessToken = (token: string): TokenPayload => {
  const decoded = jwt.verify(token, SECRET);

  if (typeof decoded !== "object" || decoded === null) {
    throw new Error("TOKEN_INVALIDO");
  }

  const { sub, username } = decoded as Record<string, unknown>;
  const id = typeof sub === "number" ? sub : Number.parseInt(String(sub), 10);

  if (!Number.isFinite(id) || typeof username !== "string") {
    throw new Error("TOKEN_INVALIDO");
  }

  return { sub: id, username };
};
