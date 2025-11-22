const KEYCLOAK_URL = "http://localhost:8080";
const ADMIN_USER = "admin";
const ADMIN_PASSWORD = "admin";
const REALM_NAME = "murasaki-poc";
const CLIENT_ID = "elysia-backend";
const TEST_USER = "testuser";
const TEST_PASSWORD = "password";

async function main() {
  console.log("Waiting for Keycloak to be ready...");
  // Simple wait loop
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`${KEYCLOAK_URL}/health`);
      if (res.ok) break;
    } catch (e) {}
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  console.log("Authenticating as admin...");
  const tokenRes = await fetch(
    `${KEYCLOAK_URL}/realms/master/protocol/openid-connect/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        username: ADMIN_USER,
        password: ADMIN_PASSWORD,
        grant_type: "password",
        client_id: "admin-cli",
      }),
    }
  );

  if (!tokenRes.ok) {
    console.error("Failed to authenticate:", await tokenRes.text());
    process.exit(1);
  }

  const { access_token } = await tokenRes.json();
  const authHeader = {
    Authorization: `Bearer ${access_token}`,
    "Content-Type": "application/json",
  };

  console.log(`Creating realm ${REALM_NAME}...`);
  const realmRes = await fetch(`${KEYCLOAK_URL}/admin/realms`, {
    method: "POST",
    headers: authHeader,
    body: JSON.stringify({
      realm: REALM_NAME,
      enabled: true,
    }),
  });

  if (!realmRes.ok && realmRes.status !== 409) {
    // 409 = already exists
    console.error("Failed to create realm:", await realmRes.text());
    process.exit(1);
  }

  console.log(`Creating client ${CLIENT_ID}...`);
  // Get client if exists
  const clientsRes = await fetch(
    `${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/clients?clientId=${CLIENT_ID}`,
    {
      headers: authHeader,
    }
  );
  let client = (await clientsRes.json())[0];

  if (!client) {
    const createClientRes = await fetch(
      `${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/clients`,
      {
        method: "POST",
        headers: authHeader,
        body: JSON.stringify({
          clientId: CLIENT_ID,
          enabled: true,
          publicClient: false,
          directAccessGrantsEnabled: true,
          serviceAccountsEnabled: true,
          standardFlowEnabled: true,
        }),
      }
    );
    if (!createClientRes.ok) {
      console.error("Failed to create client:", await createClientRes.text());
      process.exit(1);
    }
    // Fetch again
    const clientsRes2 = await fetch(
      `${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/clients?clientId=${CLIENT_ID}`,
      {
        headers: authHeader,
      }
    );
    client = (await clientsRes2.json())[0];
  }

  console.log("Getting client secret...");
  const secretRes = await fetch(
    `${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/clients/${client.id}/client-secret`,
    {
      headers: authHeader,
    }
  );
  const secretData = await secretRes.json();
  const clientSecret = secretData.value;
  console.log(`CLIENT_SECRET=${clientSecret}`);

  console.log(`Creating user ${TEST_USER}...`);
  const usersRes = await fetch(
    `${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/users?username=${TEST_USER}`,
    {
      headers: authHeader,
    }
  );
  let user = (await usersRes.json())[0];

  if (!user) {
    const createUserRes = await fetch(
      `${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/users`,
      {
        method: "POST",
        headers: authHeader,
        body: JSON.stringify({
          username: TEST_USER,
          enabled: true,
          email: `${TEST_USER}@example.com`,
          firstName: "Test",
          lastName: "User",
          credentials: [
            {
              type: "password",
              value: TEST_PASSWORD,
              temporary: false,
            },
          ],
        }),
      }
    );
    if (!createUserRes.ok) {
      console.error("Failed to create user:", await createUserRes.text());
      process.exit(1);
    }
  }

  console.log("Keycloak setup complete.");
}

main();
