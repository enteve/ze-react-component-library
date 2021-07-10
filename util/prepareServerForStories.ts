import { config } from "zeroetp-api-sdk";

export default () => {
  config.API_URL = "https://admin.xuetaifeng.com";
  localStorage.token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGRjODcxZWI5N2VlZjMzMzFkZGNiNzkiLCJpYXQiOjE2MjU5MDgwMjcsImV4cCI6MTYyNjUxMjgyN30.dp3CJBgCmA99GYSRegfeZXot6LH1C4PHfR8ujEUUz9E";
  // config.API_URL = "http://localhost:3052";
};
