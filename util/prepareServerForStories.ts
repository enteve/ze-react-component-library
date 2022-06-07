import { config } from "zeroetp-api-sdk";

export default () => {
  // config.API_URL = "http://localhost:3052";
  // config.API_URL = "https://zhouheiya.zeroetp.com";
  // config.API_URL = "https://admin.xuetaifeng.com";
  config.API_URL = "https://retail.yiwendata.com";
  // // config.API_URL = "https://jaem.yiwendata.com";
  localStorage.token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjkwOWJjOTRhODc1YWNmOTNmOThiNTYiLCJpYXQiOjE2NTM3MDI0MTIsImV4cCI6MTY2NDA3MDQxMn0.-NGGSwcbJ6vhHPbyROsinA11q1h6AjefpM61bxuWH88";
};
