import { config } from "zeroetp-api-sdk";

export default () => {
  // config.API_URL = "http://localhost:3052";
  // config.API_URL = "https://zhouheiya.zeroetp.com";
  // config.API_URL = "https://admin.xuetaifeng.com";
  config.API_URL = "https://retail.yiwendata.com";
  // config.API_URL = "https://jaem.yiwendata.com";
  localStorage.token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTgzNGM1YjU2NzUyNjQ5NGMxZmJhNjUiLCJpYXQiOjE2MzYwMDU0MzUsImV4cCI6MTYzNjYxMDIzNX0.MNFwSd6wdrZKDi3yj6dYIvJENjookq97A2RXef2Hhns";
};
