import { config } from "zeroetp-api-sdk";

export default () => {
  // config.API_URL = "http://localhost:3052";
  // config.API_URL = "https://zhouheiya.zeroetp.com";
  // config.API_URL = "https://admin.xuetaifeng.com";
  config.API_URL = "https://retail.yiwendata.com";
  // config.API_URL = "https://jaem.yiwendata.com";
  localStorage.token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjgyMWNlMDU4YWUzZWM0OGNlNTU2NTEiLCJpYXQiOjE2NTI2OTc2MjMsImV4cCI6MTY2MzA2NTYyM30.UYd_kW53Dd6OREwFS_rwZCDYWe-qSS8_ZKNEgSFp9Fs";
};
