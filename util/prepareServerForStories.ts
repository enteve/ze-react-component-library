import { config } from "zeroetp-api-sdk";

export default () => {
  // config.API_URL = "http://localhost:3052";
  // config.API_URL = "https://zhouheiya.zeroetp.com";
  // config.API_URL = "https://admin.xuetaifeng.com";
  config.API_URL = "https://retail.yiwendata.com";
  // config.API_URL = "https://jaem.yiwendata.com";
  localStorage.token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjczOTViYTA5NDM2ZmViY2IxNTlhYjAiLCJpYXQiOjE2NTE3NDIyNTQsImV4cCI6MTY2MjExMDI1NH0.XC7rDVqkXz8SX4atXruMyrFF3cQ1t_XJMBMTY9TN_E0";
};
