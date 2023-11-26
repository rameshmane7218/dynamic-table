import { atom } from "recoil";
import { atomContant } from "./constant";
const defaultState = [] as string[];
export const headerState = atom({
  key: atomContant.headerState, // unique ID (with respect to other atoms/selectors)
  default: defaultState, // default value (aka initial value)
});
