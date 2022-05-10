import { message } from "antd";

function getFormatter(text: string) {
  const unit = text.replaceAll(/[0-9.,]/g, "");
  const bit = text
    .split(".")[1]
    ?.replace(unit, "")
    .split("")
    .reduce((p) => `${p}0`, "");
  let z;
  if (bit) {
    z = `0.${bit}`;
  }
  if (text.includes(",")) {
    z = z ? `0,${z}` : "0,0";
  }
  if (unit) {
    z = z ? `${z}${unit}` : `0${unit}`;
  }
  return z;
}

function excelExporter(
  text: string,
  formattedText: string,
  filename: string,
  XLSX?: any // 外部的XLSX库
) {
  if (!XLSX) return message.error("需要传入XLSX库才能使用导出功能");

  if (filename.length === 0) {
    return message.error("导出的文件必须设定文件名");
  }
  const excelName = `${filename}.xlsx`;
  const formattedArr = formattedText
    .split("\r\n")
    .map((d) => d.split("\t").map((s) => s.slice(1, -1)));

  const arr = text.split("\r\n").map((d, i) =>
    d.split("\t").map((s, ii) => {
      // 去除多余的双引号
      const v = s.slice(1, -1);
      const formattedV: string = formattedArr[i][ii];
      const n = Number(v);
      if (v.trim().length === 0 || isNaN(n)) {
        return v;
      }
      const z = getFormatter(formattedV);
      return { v: n, t: "n", z };
    })
  );
  const worksheet = XLSX.utils.aoa_to_sheet(arr);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet);
  XLSX.writeFileXLSX(workbook, excelName, { compression: true });
}

export default excelExporter;
