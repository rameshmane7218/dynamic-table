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
  data = cloneDeep(data);

  return data;
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
      console.log("filter", isConditionTrue);
      return isConditionTrue;
    }
    return true;
  });

  return updatedData;
};
