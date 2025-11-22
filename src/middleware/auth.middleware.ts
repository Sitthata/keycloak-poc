import { Elysia } from "elysia";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { db } from "../db";

const KEYCLOAK_ISSUER =
  process.env.KEYCLOAK_ISSUER_URL ||
  "http://localhost:8080/realms/murasaki-poc";
const JWKS_URI = `${KEYCLOAK_ISSUER}/protocol/openid-connect/certs`;

const JWKS = createRemoteJWKSet(new URL(JWKS_URI));

export const authMiddleware = (app: Elysia) =>
  app.derive(async ({ request, set }) => {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      set.status = 401;
      throw new Error("Unauthorized: Missing or invalid token");
    }

    const token = authHeader.split(" ")[1];

    try {
      const { payload } = await jwtVerify(token, JWKS, {
        issuer: KEYCLOAK_ISSUER,
      });

      const sub = payload.sub;
      if (!sub) {
        throw new Error("No subject in token");
      }

      // Upsert user in local DB
      const user = await db.user.upsert({
        where: { keycloak_oid: sub },
        update: {
          email: payload.email as string,
          firstname: payload.given_name as string,
          lastname: payload.family_name as string,
        },
        create: {
          keycloak_oid: sub,
          email: payload.email as string,
          firstname: payload.given_name as string,
          lastname: payload.family_name as string,
        },
      });

      return {
        user,
      };
    } catch (err) {
      console.error("Token validation failed:", err);
      set.status = 401;
      throw new Error("Unauthorized: Invalid token");
    }
  });
