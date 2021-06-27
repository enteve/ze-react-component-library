import { config } from "zeroetp-api-sdk";

export default () => {
  config.API_URL = "https://admin.xuetaifeng.com";
  localStorage.token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGQ2YmNhNGRjMTNmNzBmYWNhMTcwNTEiLCJpYXQiOjE2MjQ3NzU4MDksImV4cCI6MTYyNTM4MDYwOX0.UxISHtmWtCK9_oG-n2SzgCtIGdTPeGnI_-sc6WJwpiM";
  // config.API_URL = "http://localhost:3052";
};
