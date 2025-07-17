import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  stages: [
    { duration: "10s", target: 1 }, // 1 user
    { duration: "10s", target: 10 }, // ramp to 10
    { duration: "10s", target: 20 }, // ramp to 20
    { duration: "10s", target: 50 }, // ramp to 50
    { duration: "10s", target: 100 }, // ramp to 100
    { duration: "10s", target: 0 }, // cooldown
  ],
};

export default function () {
  // Step 1: Login
  const loginPayload = JSON.stringify({
    email: "satyamgrandmaster@gmail.com", // replace if needed
    password: "satyamtest",
  });

  const loginRes = http.post(
    "https://maalaxmi.store/api/api/v1/auth/login",
    loginPayload,
    {
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Origin: "https://maalaxmi.store",
        Referer: "https://maalaxmi.store/",
        "User-Agent": "Mozilla/5.0",
      },
    }
  );

  check(loginRes, {
    "login status is 200": (res) => res.status === 200,
    "token exists": (res) => res.json("token") !== undefined,
  });

  const token = loginRes.json("token");

  // Step 2: Access user dashboard data (protected)
  const dashboardRes = http.get(
    "https://maalaxmi.store/api/api/v1/user/user-Dashboard-Data?page=1&limit=9",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );

  check(dashboardRes, {
    "dashboard status is 200": (res) => res.status === 200,
  });

  sleep(1);
}
