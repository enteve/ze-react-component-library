import { config } from "zeroetp-api-sdk";

export default () => {
  config.API_URL = "https://admin.xuetaifeng.com";
  localStorage.token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1VVZBR2tvcGZGQks2N1pfTVgtNGIiLCJpYXQiOjE2Mjg4MzkxMzAsImV4cCI6MTYyOTQ0MzkzMH0.bVeUOXLWSBhKZW12JcQJYkoYj4KvvzJdWCcL6OMnjis";
  // config.API_URL = "http://localhost:3052";
};
