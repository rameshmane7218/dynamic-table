import { selector } from "recoil";
import { atomConstant } from "../constant";
import { dynamicDataState } from "../atoms/dynamicDataState";

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
  }),
});
