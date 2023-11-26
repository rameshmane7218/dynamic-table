import { atom } from "recoil";
import { atomConstant } from "../constant";

const defaultState = [] as DynamicDataType;

export const dynamicDataState = atom({
  key: atomConstant.dynamicDataState, // unique ID (with respect to other atoms/selectors)
  default: defaultState, // default value (aka initial value)
});

export type DynamicDataType = Record<string, any>[];
