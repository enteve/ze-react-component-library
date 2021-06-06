import type { PropertyType } from "zeroetp-api-sdk";

export const valueTypeMapping = (property: PropertyType) => {
  switch (property.type) {
    case "currency":
      return "money";
    case "percentage":
      return "percentage";
    case "object":
      return "object";
    default:
      break;
  }

  switch (property.primal_type) {
    case "date":
      return "date";
    default:
      return undefined;
  }
};
