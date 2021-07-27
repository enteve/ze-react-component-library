import { config } from "zeroetp-api-sdk";

export default () => {
  config.API_URL = "https://admin.xuetaifeng.com";
  localStorage.token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGRjODcxZWI5N2VlZjMzMzFkZGNiNzkiLCJpYXQiOjE2MjY4NzQ0NDcsImV4cCI6MTYyNzQ3OTI0N30.5ENFrSwwlriRbGCyy5CQ_rL-LuHSOvuPpOL3dFxANnA";
  // config.API_URL = "http://localhost:3052";
};
