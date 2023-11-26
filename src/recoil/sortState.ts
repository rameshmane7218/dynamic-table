import { atom } from "recoil";
import { atomContant } from "./constant";
const defaultState = [] as SortType[];
export const sortState = atom({
  key: atomContant.sortState, // unique ID (with respect to other atoms/selectors)
  default: defaultState, // default value (aka initial value)
});

export interface SortType {
  field: string;
  type: "asc" | "dec";
}
