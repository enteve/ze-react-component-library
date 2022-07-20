// 要在浏览器的localStorage里面填入token
import { config } from "zeroetp-api-sdk";

export default () => {
  config.API_URL = "http://localhost:3052";
  // config.API_URL = "https://retail.yiwendata.com";
};
