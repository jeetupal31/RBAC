async function testLogin() {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "admin@example.com",
      password: "password"
    })
  });
  const data = await response.json();
  console.log("Status:", response.status);
  console.log("Data:", data);
  return data;
}

testLogin();
