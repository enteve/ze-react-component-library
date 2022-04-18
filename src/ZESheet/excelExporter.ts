import { message } from "antd";

function excelExporter(
  text: string,
  filename: string,
  XLSX?: any // 外部的XLSX库
) {
  if (!XLSX) return message.error("需要传入XLSX库才能使用导出功能");

  if (filename.length === 0) {
    return message.error("导出的文件必须设定文件名");
  }
  const excelName = `${filename}.xlsx`;
  const arr = text
    .split("\r\n")
    .map((d) => d.split("\t").map((s) => s.slice(1, -1)));
  const worksheet = XLSX.utils.aoa_to_sheet([...arr]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet);
  XLSX.writeFileXLSX(workbook, excelName, { compression: true });
}

export default excelExporter;
