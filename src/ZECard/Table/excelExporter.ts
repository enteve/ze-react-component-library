import { message } from "antd";

export default (
  parentNode: HTMLDivElement,
  filename: string,
  XLSX?: any // 外部的XLSX库
) => {
  if (!XLSX) return message.error("需要传入XLSX库才能使用导出功能");

  if (filename.length === 0) {
    return message.error("导出的文件必须设定文件名");
  }

  let excelName = `${filename}.xlsx`;
  const nodes = parentNode.getElementsByTagName("table");
  if (!nodes || nodes.length === 0) {
    return message.error("表格不存在");
  }
  const cloneNode = nodes[0].cloneNode(true);
  // header fixed的情况下，会有两个table
  if (nodes.length === 2) {
    const bodyNode = nodes[1].getElementsByTagName("tbody")[0].cloneNode(true);
    cloneNode.appendChild(bodyNode);
  }

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
