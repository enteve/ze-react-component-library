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
    case "number":
      return "digit";
    case "string":
      if (property.constraints.enum) {
        if (property.constraints.enum.length >= 10) {
          return "select";
        }

        return "radio";
      }
      return undefined;
    default:
      return undefined;
  }
};
