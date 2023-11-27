import { FilterType } from "@/recoil/atoms/filterState";
import { DynamicDataType } from "@/types/table";

export const getAllHeaders = (data: DynamicDataType) => {
  let allFields: Record<string, boolean> = {};
  data.forEach((item) => {
    allFields = { ...allFields, ...item };
  });

  return Object.keys(allFields).map((field) => {
    return { field, isVisible: true };
  });
};
