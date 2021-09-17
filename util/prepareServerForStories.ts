import { config } from "zeroetp-api-sdk";

export default () => {
  // config.API_URL = "http://localhost:3052";
  config.API_URL = "https://zhouheiya.zeroetp.com";
  // config.API_URL = "https://admin.xuetaifeng.com";
  // config.API_URL = "https://jaem.yiwendata.com";
  localStorage.token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDdiZDljYzNhNWM1YmRhODUxYmYxNzEiLCJpYXQiOjE2MzE4ODQ4OTcsImV4cCI6MTYzMjQ4OTY5N30.0nhGrSUxjDQ17D-IfODe8eI4LrPldndXo8l3lhqjU64";
};
