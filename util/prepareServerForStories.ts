import { config } from "zeroetp-api-sdk";

export default () => {
  // config.API_URL = "http://localhost:3052";
  // config.API_URL = "https://zhouheiya.zeroetp.com";
  // config.API_URL = "https://admin.xuetaifeng.com";
  config.API_URL = "https://retail.yiwendata.com";
  // config.API_URL = "https://jaem.yiwendata.com";
  localStorage.token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWQzYWNiMDY4Njc5NmU1NTg3ZjBmNjAiLCJpYXQiOjE2NDMxMTg3NjAsImV4cCI6MTY1MzQ4Njc2MH0.237-uASsN9DkcBT6xnMEpkgV0PWjVjT4N7rLEQkH_vo";
};
