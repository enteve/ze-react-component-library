import type { PropertyType, SchemaType } from "zeroetp-api-sdk";

export type ZEDescriptionProps = {
  schema: SchemaType;
  columnProperties: PropertyType[];
  item: any;
};
