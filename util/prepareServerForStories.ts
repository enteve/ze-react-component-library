import { config } from "zeroetp-api-sdk";

export default () => {
  // config.API_URL = "http://localhost:3052";
  // config.API_URL = "https://zhouheiya.zeroetp.com";
  // config.API_URL = "https://admin.xuetaifeng.com";
  config.API_URL = "https://retail.yiwendata.com";
  // config.API_URL = "https://jaem.yiwendata.com";
  localStorage.token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTNiMDRjZjRhNDJjMTliNDIxMGNiMjYiLCJpYXQiOjE2MzM5NTc0OTYsImV4cCI6MTYzNDU2MjI5Nn0.FAPrf28iKVFDn6kQliT7gm73XAqvqD-ZZsZpT4brxmA";
};
