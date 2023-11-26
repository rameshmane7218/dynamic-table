import { atom } from "recoil";
import { atomContant } from "./constant";
const defaultTableState = [] as Record<string, any>[];
export const tableState = atom({
  key: atomContant.tableState, // unique ID (with respect to other atoms/selectors)
  default: defaultTableState, // default value (aka initial value)
});
