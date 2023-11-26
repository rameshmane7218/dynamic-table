"use client";
import { headerState } from "@/recoil/headerState";
import { SortType, sortState } from "@/recoil/sortState";
import { tableState } from "@/recoil/tableState";
import { PlusSquareIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Select,
  Stack,
} from "@chakra-ui/react";
import React, { ChangeEvent } from "react";
import { useRecoilState } from "recoil";

const SortDataComponent = () => {
  const [sortSettings, setSortSettings] = useRecoilState(sortState);
  const [visibleFields, setVisibleFiels] = useRecoilState(headerState);

  const handleOnChaneFields = (
    e: ChangeEvent<HTMLSelectElement>,
    index: number
  ) => {
    let updatedSortData = [...sortSettings].map((sortItem, idx) => {
      if (idx === index) {
        sortItem = { ...sortItem, field: e.target.value };
      }
      return sortItem;
    });
    setSortSettings(updatedSortData);
  };
  const handleOnChangeOrder = (
    e: ChangeEvent<HTMLSelectElement>,
    index: number
  ) => {
    let updatedSortData = [...sortSettings].map((sortItem, idx) => {
      if (idx === index) {
        sortItem = { ...sortItem, type: e.target.value as SortType["type"] };
      }
      return sortItem;
    });
    setSortSettings(updatedSortData);
  };

  const handleAddSort = () => {
    setSortSettings((prev) => {
      return [...prev, { field: "", type: "asc" }];
    });
  };

  return (
    <Box>
      <Popover>
        <PopoverTrigger>
          <Button>Sort</Button>
        </PopoverTrigger>
        <Portal>
          <PopoverContent>
            <PopoverBody p={4}>
              <Stack gap={2}>
                {sortSettings.map((settings, idx) => (
                  <Flex gap={2} key={idx}>
                    <Select
                      placeholder="Select field"
                      onChange={(e) => handleOnChaneFields(e, idx)}
                      value={settings.field}
                    >
                      {visibleFields.map((field, index) => (
                        <option value={field} key={index}>
                          {field}
                        </option>
                      ))}
                    </Select>
                    <Select
                      placeholder="order"
                      onChange={(e) => handleOnChangeOrder(e, idx)}
                      value={settings.type}
                    >
                      {["asc", "des"].map((order, index) => (
                        <option value={order} key={index}>
                          {order == "asc" ? "A to Z" : "Z to A"}
                        </option>
                      ))}
                    </Select>
                  </Flex>
                ))}
              </Stack>
              <Button
                variant={"outline"}
                leftIcon={<PlusSquareIcon />}
                onClick={handleAddSort}
                mt={2}
              >
                Add Sort
              </Button>
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
    </Box>
  );
};

export default SortDataComponent;
