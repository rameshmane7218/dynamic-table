"use client";
import { FilterType } from "@/recoil/atoms/filterState";
import { SortType } from "@/recoil/atoms/sortState";
import { DynamicDataType } from "@/types/table";
import cloneDeep from "lodash/cloneDeep";

export const handleSortData = ({
  data = [],
  sortSettings,
}: {
  data: DynamicDataType;
  sortSettings: SortType[];
}): DynamicDataType => {
  const identifyField = (value: any) => {
    // Check if the string is a number
    if (!isNaN(Number(value))) {
      return "Number";
    }

    // Check if the string is a date
    if (!isNaN(Date.parse(value))) {
      return "Date";
    }

    // If it's not a number or date, consider it as a generic string
    return "String";
  };
  let updatedData = cloneDeep(data).sort((a, b) => {
    let sortCondition = 0;

    for (const { field, orderBy } of sortSettings) {
      if (field && orderBy) {
        if (orderBy == "asc") {
          switch (identifyField(a[field])) {
            case "Number": {
              sortCondition =
                sortCondition || Number(a[field]) - Number(b[field]);
              break;
            }
            case "Date": {
              sortCondition =
                sortCondition || Date.parse(a[field]) - Date.parse(b[field]);
              break;
            }
            default: {
              sortCondition =
                sortCondition || a[field]?.localeCompare(b[field]);
            }
          }
        } else {
          switch (identifyField(a[field])) {
            case "Number": {
              sortCondition =
                sortCondition || Number(b[field]) - Number(a[field]);
              break;
            }
            case "Date": {
              sortCondition =
                sortCondition || Date.parse(b[field]) - Date.parse(a[field]);
              break;
            }
            default: {
              sortCondition =
                sortCondition || b[field]?.localeCompare(a[field]);
            }
          }
        }
      }
    }
    return sortCondition;
  });

  return updatedData;
};

export const handleFilterData = ({
  data = [],
  filterSettings,
}: {
  data: DynamicDataType;
  filterSettings: FilterType[];
}): DynamicDataType => {
  let updatedData = cloneDeep(data).filter((item) => {
    if (filterSettings.length) {
      let isConditionTrue = true;
      for (const filterOption of filterSettings) {
        if (filterOption.field) {
          if (filterOption.field && filterOption.operator == "equal") {
            isConditionTrue =
              isConditionTrue && item[filterOption.field] == filterOption.value;
          } else if (filterOption.field && filterOption.operator == "like") {
            isConditionTrue =
              isConditionTrue &&
              item[filterOption.field]
                .toLowerCase()
                .includes(filterOption.value.toLowerCase());
          }
        }
      }
      return isConditionTrue;
    }
    return true;
  });

  return updatedData;
};

export const store = {
  get: <T>(key: string): T | void => {
    let value = window?.localStorage?.getItem(key);
    if (value) {
      return JSON.parse(value) as T;
    }
  },
};
