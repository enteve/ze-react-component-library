import { config } from "zeroetp-api-sdk";

export default () => {
  config.API_URL = "https://admin.xuetaifeng.com";
  localStorage.token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTBiYzgyNjVlZWQ2ZjRmMmNiZDBkMTQiLCJpYXQiOjE2Mjg0OTU3ODQsImV4cCI6MTYyOTEwMDU4NH0.RYw0_iH70byE9JISwAwH76JWPScK05c6GpksoeIIxKM";
  // config.API_URL = "http://localhost:3052";
};
