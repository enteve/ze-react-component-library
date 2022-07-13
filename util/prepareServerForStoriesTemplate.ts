// 复制一份出来，改名为prepareServerForStories.ts才可以启动系统
import { config } from "zeroetp-api-sdk";

export default () => {
  config.API_URL = "http://localhost:3052";
  // config.API_URL = "https://retail.yiwendata.com";
  localStorage.token =  "";
};
