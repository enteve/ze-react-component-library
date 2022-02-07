import { config } from "zeroetp-api-sdk";

export default () => {
  // config.API_URL = "http://localhost:3052";
  // config.API_URL = "https://zhouheiya.zeroetp.com";
  // config.API_URL = "https://admin.xuetaifeng.com";
  config.API_URL = "https://retail.yiwendata.com";
  // config.API_URL = "https://jaem.yiwendata.com";
  localStorage.token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWZmY2Y1MTMwN2M4ZDBkMGY2MDkzN2IiLCJpYXQiOjE2NDQyMDIxNzQsImV4cCI6MTY1NDU3MDE3NH0.Y43y5T7hPln-Il1vFebKVViov3YnfmVHWgFwkwvXydY";
};
