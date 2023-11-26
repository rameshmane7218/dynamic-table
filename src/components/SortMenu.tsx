"use client";
import { handleFilterData, handleSortData } from "@/lib/utils";
import { headerState } from "@/recoil/atoms/headerState";
import { SortType, sortState } from "@/recoil/atoms/sortState";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Select,
  Stack,
} from "@chakra-ui/react";
import { SignalHigh } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import debounce from "lodash/debounce";
import { dynamicDataState } from "@/recoil/atoms/dynamicDataState";
import { tableState } from "@/recoil/atoms/tableState";
import { filterState } from "@/recoil/atoms/filterState";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { localStorageKeys } from "@/recoil/constant";

const SortMenu = () => {
  const setTableData = useSetRecoilState(tableState);
  const [localSortSettings, setLocalSortSettings] = useLocalStorage<SortType[]>(
    localStorageKeys.sortSettings,
    []
  );
  const [sortSettings, setSortSettings] = useRecoilState(sortState);
  const filterSettings = useRecoilValue(filterState);
  const visibleFields = useRecoilValue(headerState);
  const [usedFields, setUsedFields] = useState<Record<string, boolean>>({});
  const dynamicData = useRecoilValue(dynamicDataState);

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
    setSortSettings((prev) => {
      return [...prev].map((item, idx) => {
        if (idx === index) {
          item = { ...item, [name]: type === "number" ? Number(value) : value };
        }
        return item;
      });
    });
  };

  /**
   * handle delete sort option
   * @param {number} index
   * @returns {void}
   */
  const handleDeleteSort = (index: number): void => {
    setSortSettings((prev) => {
      return prev.filter((_, idx) => idx != index);
    });
  };

  /**
   * Handles add new sort option in sort settings
   * Appends a new sort object with default values to the existing sort settings.
   * @returns {void}
   */
  const handleAddSort = (): void => {
    setSortSettings((prev) => {
      return [...prev, { field: "", orderBy: "asc" }];
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
    let usedFields = sortSettings.reduce((acc, current) => {
      if (current.field) {
        acc = { ...acc, [current.field]: true };
      }
      return acc;
    }, {});
    setUsedFields({ ...usedFields });

    setLocalSortSettings([...sortSettings]);

    if (dynamicData.length) {
      handleFilterWithDebounce();
    }
  }, [sortSettings, dynamicData]);

  return (
    <Box>
      <Popover placement="bottom-start" closeOnBlur>
        <PopoverTrigger>
          <Button
            leftIcon={<SignalHigh width={"1em"} height={"1em"} />}
            variant="outline"
          >
            Sort
          </Button>
        </PopoverTrigger>
        <Portal>
          <PopoverContent width={"md"}>
            <PopoverBody p={4}>
              <Stack gap={2}>
                {sortSettings.map((settings, idx) => (
                  <Flex gap={2} key={idx}>
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
                      required
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
                      placeholder="Order By"
                      onChange={(e) => {
                        handleOnChange({
                          name: "orderBy",
                          value: e.target.value,
                          index: idx,
                        });
                      }}
                      value={settings.orderBy}
                      size={"sm"}
                      rounded={"md"}
                    >
                      {["asc", "desc"].map((order, index) => (
                        <option value={order} key={index}>
                          {order == "asc" ? "A to Z" : "Z to A"}
                        </option>
                      ))}
                    </Select>

                    <IconButton
                      aria-label="delete"
                      icon={<DeleteIcon />}
                      size={"sm"}
                      variant={"ghost"}
                      onClick={() => {
                        handleDeleteSort(idx);
                      }}
                    />
                  </Flex>
                ))}
              </Stack>
              <Button
                variant="ghost"
                leftIcon={<AddIcon />}
                onClick={handleAddSort}
                mt={2}
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

export default SortMenu;
