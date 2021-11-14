import { config } from "zeroetp-api-sdk";

export default () => {
  // config.API_URL = "http://localhost:3052";
  // config.API_URL = "https://zhouheiya.zeroetp.com";
  config.API_URL = "https://admin.xuetaifeng.com";
  // config.API_URL = "https://retail.yiwendata.com";
  // config.API_URL = "https://jaem.yiwendata.com";
  localStorage.token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTBiYzgyNjVlZWQ2ZjRmMmNiZDBkMTQiLCJpYXQiOjE2MzY4NjQ5MTAsImV4cCI6MTYzNzQ2OTcxMH0.J24iKm__c4OUAfAUUDI_7ObRmCordZX4ZWUnlc3oDCc";
};
