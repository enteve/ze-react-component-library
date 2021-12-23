import { config } from "zeroetp-api-sdk";

export default () => {
  // config.API_URL = "http://localhost:3052";
  // config.API_URL = "https://zhouheiya.zeroetp.com";
  config.API_URL = "https://admin.xuetaifeng.com";
  // config.API_URL = "https://retail.yiwendata.com";
  // config.API_URL = "https://jaem.yiwendata.com";
  localStorage.token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTBiYzgyNjVlZWQ2ZjRmMmNiZDBkMTQiLCJpYXQiOjE2NDAxNzk0NzcsImV4cCI6MTY0MDc4NDI3N30.zGpYG93g_MGYqtdF_Q9ZhuOPjDnyQ61Fc9ZXPm7ogeE";
};
