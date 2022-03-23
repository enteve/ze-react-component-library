import { config } from "zeroetp-api-sdk";

export default () => {
  // config.API_URL = "http://localhost:3052";
  // config.API_URL = "https://zhouheiya.zeroetp.com";
  // config.API_URL = "https://admin.xuetaifeng.com";
  config.API_URL = "https://retail.yiwendata.com";
  // config.API_URL = "https://jaem.yiwendata.com";
  localStorage.token =
    // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTBiYzgyNjVlZWQ2ZjRmMmNiZDBkMTQiLCJpYXQiOjE2NDQzMTY1MDQsImV4cCI6MTY1NDY4NDUwNH0.qa-3fQo5oeYyIgqy_ir_Pf7tU4ePXWXOKvF0EylA_X8";
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjMyYjY1MWNjYzg2Nzg3YTViYTJmMjkiLCJpYXQiOjE2NDgwMjE0NzcsImV4cCI6MTY1ODM4OTQ3N30.suKgI6iLWum7tbVttgKS1HSAAIrSNbDTxvNHsMeVitQ";
};
