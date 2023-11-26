import { selector } from "recoil";
import { atomConstant } from "../constant";
import { dynamicDataState } from "../atoms/dynamicDataState";
import { FieldType } from "../atoms/fieldState";

export const dynamicDataInfo = selector({
  key: atomConstant.dynamicDataInfo,
  get: ({ get }) => ({
    total: get(dynamicDataState).length,
    headers: (() => {
      let allFields: Record<string, boolean> = {};
      get(dynamicDataState).forEach((item) => {
        allFields = { ...allFields, ...item };
      });

      for (const key in allFields) {
        allFields[key] = true;
      }
      return allFields;
    })(),
    fields: ((): FieldType[] => {
      let allFields: Record<string, boolean> = {};
      get(dynamicDataState).forEach((item) => {
        allFields = { ...allFields, ...item };
      });

      return Object.keys(allFields).map((field) => {
        return { field, isVisible: true };
      });
    })(),
  }),
});
