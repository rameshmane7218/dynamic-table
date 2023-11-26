import { atom } from "recoil";
import { atomConstant } from "../constant";

const defaultState = [] as FieldType[];

export const fieldState = atom({
  key: atomConstant.fieldState, // unique ID (with respect to other atoms/selectors)
  default: defaultState, // default value (aka initial value)
});

export interface FieldType {
  field: string;
  isVisible: boolean;
}
