import { atom } from "recoil";
import { atomConstant } from "../constant";

const defaultState = [] as FilterType[];

export const filterState = atom({
  key: atomConstant.filterState, // unique ID (with respect to other atoms/selectors)
  default: defaultState, // default value (aka initial value)
});

export interface FilterType {
  field: string;
  operator: "equal" | "like";
  value: string;
}
