import { config } from "zeroetp-api-sdk";

export default () => {
  // config.API_URL = "http://localhost:3052";
  // config.API_URL = "https://zhouheiya.zeroetp.com";
  // config.API_URL = "https://admin.xuetaifeng.com";
  config.API_URL = "https://retail.yiwendata.com";
  // config.API_URL = "https://jaem.yiwendata.com";
  localStorage.token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWQzYWNiMDY4Njc5NmU1NTg3ZjBmNjAiLCJpYXQiOjE2NDEyNjIzMzIsImV4cCI6MTY1MTYzMDMzMn0.E7l_-oGE7HG0U1XQh9Uw051riSu8eb8tncFlBBupsqs";
};
