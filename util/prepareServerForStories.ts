import { config } from "zeroetp-api-sdk";

export default () => {
  config.API_URL = "https://admin.xuetaifeng.com";
  localStorage.token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGRjODcxZWI5N2VlZjMzMzFkZGNiNzkiLCJpYXQiOjE2MjY2NjAxOTQsImV4cCI6MTYyNzI2NDk5NH0.7CQlKNAZ_o61R5Htj3C3PU11FiitXnBV3VLSJc0OeBc";
  // config.API_URL = "http://localhost:3052";
};
