import { config } from "zeroetp-api-sdk";

export default () => {
  // config.API_URL = "http://localhost:3052";
  // config.API_URL = "https://zhouheiya.zeroetp.com";
  // config.API_URL = "https://admin.xuetaifeng.com";
  config.API_URL = "https://retail.yiwendata.com";
  // config.API_URL = "https://jaem.yiwendata.com";
  localStorage.token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWE0ODY4ZjgyMWY3YjQ3YWQ4MzhmNzMiLCJpYXQiOjE2NDAzMzU3NzMsImV4cCI6MTY1MDcwMzc3M30.E7RwNNloNujiANrYPTplYpWTuxgH4vW4lrC3wWzKhf8";
};
