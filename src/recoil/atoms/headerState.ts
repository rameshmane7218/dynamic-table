import { atom } from "recoil";
import { atomConstant } from "../constant";
const defaultState = [] as string[];
export const headerState = atom({
  key: atomConstant.headerState, // unique ID (with respect to other atoms/selectors)
  default: defaultState, // default value (aka initial value)
});
