import { config } from "zeroetp-api-sdk";

export default () => {
  config.API_URL = "https://admin.xuetaifeng.com";
  localStorage.token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGQ4YTExODM2M2IxYjFjMTNlNmI1NzAiLCJpYXQiOjE2MjQ4MTEwODgsImV4cCI6MTYyNTQxNTg4OH0.eO6px_9_pf3zaBMtbgJeWHR3-stYKB6V7yDuHdX8ekk";
  // config.API_URL = "http://localhost:3052";
};
