"use client";
import { handleFilterData, handleSortData } from "@/lib/utils";
import { FilterType, filterState } from "@/recoil/atoms/filterState";
import { headerState } from "@/recoil/atoms/headerState";
import { tableState } from "@/recoil/atoms/tableState";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Select,
  Stack,
} from "@chakra-ui/react";
import { FilterIcon } from "lucide-react";
import React, { RefObject, useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import debounce from "lodash/debounce";
import { dynamicDataState } from "@/recoil/atoms/dynamicDataState";
import { sortState } from "@/recoil/atoms/sortState";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { localStorageKeys } from "@/recoil/constant";

const FilterMenu = () => {
  const [, setLocalFilterSettings] = useLocalStorage<FilterType[]>(
    localStorageKeys.filterSettings,
    []
  );
  const setTableData = useSetRecoilState(tableState);
  const [filterSettings, setFilterSettings] = useRecoilState(filterState);
  const sortSettings = useRecoilValue(sortState);

  const visibleFields = useRecoilValue(headerState);
  const [usedFields, setUsedFields] = useState<Record<string, boolean>>({});
  const dynamicData = useRecoilValue(dynamicDataState);

  /**
   * Ref object to store a reference to the popover content element.
   * Helps address the issue of popover losing focus or not closing on certain state changes.
   * @type {React.RefObject<any>}
   * @see {@link https://github.com/chakra-ui/chakra-ui/issues/7359}
   */
  const popoverContentRef: RefObject<any> = useRef(null);

  /**
   * Handle change event for an input field.
   *
   * @param {Object} param0 - The parameters object.
   * @param {string} param0.name - The name of the input field.
   * @param {string} param0.value - The value of the input field.
   * @param {number} param0.index - The index of the input field.
   * @param {("text" | "number" | "boolean")} [param0.type="text"] - The type of the input field.
   * @returns {void}
   */
  const handleOnChange = ({
    name,
    value,
    index,
    type = "text",
  }: {
    name: string;
    value: string;
    index: number;
    type?: "text" | "number" | "boolean";
  }): void => {
    setFilterSettings((prev) => {
      return [...prev].map((item, idx) => {
        if (idx === index) {
          item = { ...item, [name]: type === "number" ? Number(value) : value };
        }
        return item;
      });
    });
  };

  /**
   * handle delete filter option
   * @param {number} index
   * @returns {void}
   */
  const handleDeleteFilter = (index: number): void => {
    setFilterSettings((prev) => {
      return prev.filter((_, idx) => idx != index);
    });
  };

  /**
   * Handles add new filter option in filter settings
   * Appends a new filter object with default values to the existing filter settings.
   * @returns {void}
   */
  const handleAddFilter = (): void => {
    setFilterSettings((prev) => {
      return [...prev, { field: "", operator: "equal", value: "" }];
    });
  };

  const handleFilterWithDebounce = debounce(() => {
    const filtredData = handleFilterData({
      data: dynamicData,
      filterSettings: [
        ...filterSettings.filter((item) => item.field && item.value),
      ],
    });
    const sortedData = handleSortData({
      data: filtredData,
      sortSettings: [
        ...sortSettings.filter((item) => item.field && item.orderBy),
      ],
    });
    setTableData(sortedData);
  }, 750);

  useEffect(() => {
    let usedFields = filterSettings.reduce((acc, current) => {
      if (current.field) {
        acc = { ...acc, [current.field]: true };
      }
      return acc;
    }, {});
    setUsedFields({ ...usedFields });

    setLocalFilterSettings([...filterSettings]);

    if (dynamicData.length) {
      handleFilterWithDebounce();
    }
  }, [filterSettings, dynamicData]);

  return (
    <Box>
      <Popover placement="bottom-start">
        <PopoverTrigger>
          <Button
            leftIcon={<FilterIcon width={"1em"} height={"1em"} />}
            variant="outline"
          >
            Filter
          </Button>
        </PopoverTrigger>
        <Portal>
          <PopoverContent ref={popoverContentRef} width={"lg"}>
            <PopoverBody p={4}>
              <Stack gap={2} mb={filterSettings.length ? 2 : 0}>
                {filterSettings.map((settings, idx) => (
                  <Flex gap={2} key={idx}>
                    <Select
                      placeholder="Where"
                      isReadOnly={true}
                      isDisabled={true}
                      size={"sm"}
                      rounded={"md"}
                    ></Select>
                    <Select
                      placeholder="Field Name"
                      onChange={(e) => {
                        handleOnChange({
                          name: "field",
                          value: e.target.value,
                          index: idx,
                        });
                      }}
                      value={settings.field}
                      size={"sm"}
                      rounded={"md"}
                    >
                      {visibleFields.map((field, index) => (
                        <option
                          value={field}
                          key={index}
                          disabled={
                            settings.field !== field && usedFields[field]
                          }
                        >
                          {field}
                        </option>
                      ))}
                    </Select>
                    <Select
                      placeholder="Operator"
                      onChange={(e) => {
                        handleOnChange({
                          name: "operator",
                          value: e.target.value,
                          index: idx,
                        });
                      }}
                      value={settings.operator}
                      size={"sm"}
                      rounded={"md"}
                    >
                      {["equal", "like"].map((operator, index) => (
                        <option value={operator} key={index}>
                          {operator}
                        </option>
                      ))}
                    </Select>

                    <Input
                      placeholder="Add Value"
                      size="sm"
                      rounded={"md"}
                      onChange={(e) => {
                        handleOnChange({
                          name: "value",
                          value: e.target.value,
                          index: idx,
                        });
                      }}
                      value={settings.value}
                    />
                    <IconButton
                      type="button"
                      aria-label={`delete-option-${idx}`}
                      icon={<DeleteIcon />}
                      size={"sm"}
                      variant={"ghost"}
                      onClick={(e) => {
                        handleDeleteFilter(idx);
                        popoverContentRef.current.focus();
                      }}
                    />
                  </Flex>
                ))}
              </Stack>
              <Button
                variant="ghost"
                leftIcon={<AddIcon />}
                onClick={handleAddFilter}
                colorScheme="blue"
                size={"sm"}
              >
                Add filter
              </Button>
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
    </Box>
  );
};

export default FilterMenu;
