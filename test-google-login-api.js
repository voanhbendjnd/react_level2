// Test script để kiểm tra Google Login API
// Chạy: node test-google-login-api.js

const axios = require("axios");

const BASE_URL = "http://localhost:8080";

async function testGoogleLoginAPI() {
  console.log("🧪 Testing Google Login API...\n");

  try {
    // Test 1: Gọi API để lấy Google OAuth URL
    console.log("1️⃣ Testing GET /api/v1/auth/google/login");
    const response = await axios.get(`${BASE_URL}/api/v1/auth/google/login`, {
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Status:", response.status);
    console.log("✅ Response:", JSON.stringify(response.data, null, 2));

    if (response.data.success && response.data.data && response.data.data.url) {
      console.log("✅ Google OAuth URL retrieved successfully");
      console.log("🔗 URL:", response.data.data.url);
    } else {
      console.log("❌ Invalid response format");
    }
  } catch (error) {
    console.log("❌ Error occurred:");

    if (error.response) {
      // Server responded with error status
      console.log("Status:", error.response.status);
      console.log("Data:", error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.log("Network Error: No response received");
      console.log("Make sure backend is running on http://localhost:8080");
    } else {
      // Something else happened
      console.log("Error:", error.message);
    }
  }
}

async function testOAuth2Endpoint() {
  console.log("\n2️⃣ Testing OAuth2 endpoint directly...");

  try {
    const response = await axios.get(
      `${BASE_URL}/oauth2/authorization/google`,
      {
        maxRedirects: 0,
        validateStatus: function (status) {
          return status >= 200 && status < 400; // Accept redirects
        },
      }
    );

    console.log("✅ OAuth2 endpoint is accessible");
    console.log("Status:", response.status);
  } catch (error) {
    if (
      error.response &&
      error.response.status >= 300 &&
      error.response.status < 400
    ) {
      console.log("✅ OAuth2 endpoint redirects correctly");
      console.log("Status:", error.response.status);
      console.log("Location:", error.response.headers.location);
    } else {
      console.log("❌ OAuth2 endpoint error:");
      console.log("Status:", error.response?.status);
      console.log("Error:", error.message);
    }
  }
}

async function runTests() {
  console.log("🚀 Starting Google Login API Tests\n");
  console.log("Backend URL:", BASE_URL);
  console.log("=".repeat(50));

  await testGoogleLoginAPI();
  await testOAuth2Endpoint();

  console.log("\n" + "=".repeat(50));
  console.log("🏁 Tests completed");
}

// Chạy tests
runTests().catch(console.error);
