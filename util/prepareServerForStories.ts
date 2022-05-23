import { config } from "zeroetp-api-sdk";

export default () => {
  // config.API_URL = "http://localhost:3052";
  // config.API_URL = "https://zhouheiya.zeroetp.com";
  // config.API_URL = "https://admin.xuetaifeng.com";
  config.API_URL = "https://retail.yiwendata.com";
  // // config.API_URL = "https://jaem.yiwendata.com";
  localStorage.token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Mjg1YWFjZjVlMDdhMzk4YjJjODE5ZTkiLCJpYXQiOjE2NTI5MjcyMzYsImV4cCI6MTY2MzI5NTIzNn0.dQg8uFOvI-4NawQIT9j-__AT7xzHXXp4jbFx9MIyku0";
};
