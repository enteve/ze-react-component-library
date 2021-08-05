import { config } from "zeroetp-api-sdk";

export default () => {
  config.API_URL = "http://localhost:3052";
  localStorage.token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGRjODcxZWI5N2VlZjMzMzFkZGNiNzkiLCJpYXQiOjE2Mjc1MzAxMzQsImV4cCI6MTYyODEzNDkzNH0.Ckn8mxPiQ2nDoDPeEEwx6OX2AFAJiN374SRy0mpJE_M";
  // config.API_URL = "http://localhost:3052";
};
