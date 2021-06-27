import XLSX from "xlsx";
import { LogicformAPIResultType } from "zeroetp-api-sdk";
import { customValueTypes } from "../util";

export default (result: LogicformAPIResultType, filename: string) => {
  const customRender = customValueTypes(result.schema);
  const ws = XLSX.utils.json_to_sheet(
    result.result.map((i) => {
      const newI = {};
      result.columnProperties.forEach((p) => {
        if (p.name in i) {
          if (p.type in customRender) {
            newI[p.name] = customRender[p.type].render(
              i[p.name],
              { proFieldKey: `fake-${p.name}` } // 这是一个fake的proFieldKey
            );
          } else {
            newI[p.name] = i[p.name];
          }
        }
      });

      return newI;
    }),
    {
      header: result.columnProperties.map((p) => p.name),
    }
  );

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet01");

  XLSX.writeFile(wb, `${filename.length > 0 ? filename : "数据导出"}.xlsx`);
};
