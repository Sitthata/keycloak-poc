const KEYCLOAK_URL =
  process.env.KEYCLOAK_ISSUER_URL?.split("/realms")[0] ||
  "http://localhost:8080";
const REALM = process.env.KEYCLOAK_REALM || "murasaki-poc";
const CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID || "elysia-backend";
const CLIENT_SECRET = process.env.KEYCLOAK_CLIENT_SECRET;

export const authService = {
  async login(email: string, password: string) {
    const params = new URLSearchParams();
    params.append("grant_type", "password");
    params.append("client_id", CLIENT_ID);
    if (CLIENT_SECRET) {
      params.append("client_secret", CLIENT_SECRET);
    }
    params.append("username", email); // Keycloak uses 'username' for the login field
    params.append("password", password);

    const tokenUrl = `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`;

    try {
      const response = await fetch(tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error_description || data.error || "Authentication failed"
        );
      }

      return data;
    } catch (error: any) {
      throw new Error(error.message || "Authentication failed");
    }
  },
};
