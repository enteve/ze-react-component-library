import { config } from "zeroetp-api-sdk";

export default () => {
  // config.API_URL = "http://localhost:3052";
  // config.API_URL = "https://zhouheiya.zeroetp.com";
  // config.API_URL = "https://admin.xuetaifeng.com";
  config.API_URL = "https://retail.yiwendata.com";
  // config.API_URL = "https://jaem.yiwendata.com";
  localStorage.token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTY2ZDA1NDJmZmQyNjNmYzE2NTBlYmUiLCJpYXQiOjE2MzQ3MzY2OTAsImV4cCI6MTYzNTM0MTQ5MH0.HQWo8k9txFOeSCDg9zM4DaAzOO0rBAL7s3nqFvMkzpE";
};
