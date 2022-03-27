import moment from "moment";
import { isRelativeDateForm, normaliseRelativeDateForm } from "zeroetp-api-sdk";

export const logicformValueToColumnFilter = (oldV: any) => {
  let v = oldV;

  if (v === undefined || typeof v !== "object") {
    return v;
  }

  if (v.$lte && isRelativeDateForm(v.$lte)) {
    v.$lte = normaliseRelativeDateForm(v.$lte);
    v.$lte = v.$lte.$lte;
  }

  if (v.$gte && isRelativeDateForm(v.$gte)) {
    v.$gte = normaliseRelativeDateForm(v.$gte);
    v.$gte = v.$gte.$gte;
  }

  if (isRelativeDateForm(v)) {
    v = normaliseRelativeDateForm(v);
  }

  if (typeof v.$lte === "number" || typeof v.$gte === "number") {
    return [v.$gte, v.$lte];
  }

  if (
    v.$lte &&
    v.$gte &&
    ((typeof v.$lte === "string" && moment(v.$lte).isValid()) ||
      v.$lte instanceof Date ||
      v.$lte instanceof moment)
  ) {
    return [
      moment(v.$gte).format("YYYY-MM-DD"),
      moment(v.$lte).format("YYYY-MM-DD"),
    ];
  }

  if (v.$in) {
    return v.$in;
  }

  if (typeof v === "object" && v.operator === "$ent") {
    return v.name;
  }

  if (typeof v === "object" && "$regex" in v) {
    return v["$regex"];
  }

  return "";
};
