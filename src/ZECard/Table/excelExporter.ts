import { message } from "antd";
import { LogicformAPIResultType } from "zeroetp-api-sdk";

export default (
  result: LogicformAPIResultType,
  filename: string,
  XLSX?: any // 外部的XLSX库
) => {
  if (!XLSX) return message.error("需要传入XLSX库才能使用导出功能");

  if (filename.length === 0) {
    return message.error("导出的文件必须设定文件名");
  }

  let excelName = `${filename}.xlsx`;
  const node = document
    .getElementsByClassName(filename)[0]
    ?.getElementsByTagName("table")[0];
  if (!node) {
    return message.error("表格不存在");
  }
  const cloneNode = node.cloneNode(true);

  // 有时候ProTable会有一个hidden row，给删了。有时候没有
  if (
    (cloneNode.lastChild.firstChild as HTMLElement).getAttribute("aria-hidden")
  ) {
    cloneNode.lastChild.firstChild.remove();
  }

  const wb = XLSX.utils.table_to_book(cloneNode, {
    display: true,
  });
  XLSX.writeFileXLSX(wb, excelName, { compression: true });
};
