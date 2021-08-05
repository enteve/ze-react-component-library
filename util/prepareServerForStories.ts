import { config } from "zeroetp-api-sdk";

export default () => {
  config.API_URL = "https://admin.xuetaifeng.com";
  localStorage.token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTBiYzgyNjVlZWQ2ZjRmMmNiZDBkMTQiLCJpYXQiOjE2MjgxNjIwOTIsImV4cCI6MTYyODc2Njg5Mn0.HVgaE3TQQzrZ7-5iF4mWZedj2Of7mibMIWjpvN3Wsr8";
  // config.API_URL = "http://localhost:3052";
};
