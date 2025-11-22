const API_URL = "http://localhost:5556";
const EMAIL = "testuser@example.com";
const PASSWORD = "password";

async function main() {
  console.log("1. Testing Login...");
  const loginRes = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });

  if (!loginRes.ok) {
    console.error("Login failed:", await loginRes.text());
    process.exit(1);
  }

  const tokens = await loginRes.json();
  console.log(tokens)
  console.log("Login successful. Access Token received.");
  const accessToken = tokens.access_token;

  console.log("\n2. Testing Create Post (Protected)...");
  const postRes = await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      title: "Hello World from Verification Script",
      content: "This post was created via automated testing.",
    }),
  });

  if (!postRes.ok) {
    console.error("Create Post failed:", await postRes.text());
    process.exit(1);
  }

  const post = await postRes.json();
  console.log("Post created successfully:", post);

  console.log("\n3. Testing Unauthorized Access...");
  const failRes = await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "Should fail" }),
  });

  if (failRes.status === 401) {
    console.log("Unauthorized access correctly blocked (401).");
  } else {
    console.error("Expected 401, got:", failRes.status);
    process.exit(1);
  }

  console.log("\nVerification passed!");
}

main();
