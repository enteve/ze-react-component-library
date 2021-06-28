import { message } from "antd";
import XLSX from "xlsx";
import { LogicformAPIResultType } from "zeroetp-api-sdk";
import { customValueTypes } from "../util";

export default (result: LogicformAPIResultType, filename: string) => {
  if (result.total && result.total > result.result.length) {
    return message.error("这个要用全局导出做，还没做");
  }

  if (filename.length === 0) {
    return message.error("导出的文件必须设定文件名");
  }

  let excelName = `${filename}.xlsx`;
  const wb = XLSX.utils.table_to_book(
    document
      .getElementsByClassName(filename)[0]
      .getElementsByTagName("table")[0],
    { display: true }
  );
  XLSX.writeFile(wb, excelName);
};
