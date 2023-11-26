import { atom } from "recoil";
import { atomConstant } from "../constant";

const defaultState = [] as SortType[];

export const sortState = atom({
  key: atomConstant.sortState, // unique ID (with respect to other atoms/selectors)
  default: defaultState, // default value (aka initial value)
});

export interface SortType {
  field: string;
  orderBy: "asc" | "desc";
}
