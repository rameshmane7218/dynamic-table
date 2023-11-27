"use client";
import React, { useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Stack,
  Switch,
} from "@chakra-ui/react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useRecoilState, useSetRecoilState } from "recoil";
import { headerState } from "@/recoil/atoms/headerState";
import { ListIcon } from "lucide-react";
import { localStorageKeys } from "@/recoil/constant";
import { FieldType, fieldState } from "@/recoil/atoms/fieldState";

const getVisibleFields = (data: FieldType[]) => {
  let visibleFields = [] as string[];

  data.forEach((item) => {
    if (item.isVisible) {
      visibleFields = [...visibleFields, item.field];
    }
  });
  return visibleFields;
};

const FieldsMenu = () => {
  const setVisibleFields = useSetRecoilState(headerState);
  const [fieldSettings, setFieldSettings] = useRecoilState(fieldState);
  const [, setLocalFieldSettings] = useLocalStorage<FieldType[]>(
    localStorageKeys.fields,
    []
  );

  const handleOnChange = ({
    name,
    value,
    index,
  }: {
    name: string;
    value: boolean;
    index: number;
  }) => {
    let updatedData = [...fieldSettings].map((item, idx) => {
      if (idx === index) {
        item = { ...item, [name]: !!value };
      }
      return item;
    });
    setFieldSettings([...updatedData]);
    setLocalFieldSettings([...updatedData]);
  };

  useEffect(() => {
    const visibleFields = getVisibleFields(fieldSettings);
    setVisibleFields(visibleFields);
  }, [fieldSettings]);

  return (
    <Box>
      <Popover placement="bottom-start">
        <PopoverTrigger>
          <Button
            leftIcon={<ListIcon width={"1em"} height={"1em"} />}
            data-testid="field-menu-trigger"
            variant="outline"
          >
            Fields
          </Button>
        </PopoverTrigger>
        <Portal>
          <PopoverContent>
            <PopoverBody p={4}>
              <Stack
                gap={0}
                rounded={"md"}
                border={"1px solid"}
                borderColor={"inherit"}
                data-testid="field-menu-options"
              >
                {fieldSettings.map((item, index, arr) => (
                  <FormControl
                    as={Flex}
                    width={"100%"}
                    gap={4}
                    py={1}
                    px={2}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    key={index}
                    {...(arr.length - 1 !== index
                      ? { borderBottom: "1px", borderBottomColor: "inherit" }
                      : {})}
                  >
                    <FormLabel htmlFor={item.field}>{item.field}</FormLabel>
                    {/* <span></span>{" "} */}
                    <Switch
                      aria-label="fds"
                      id={item.field}
                      name={item.field}
                      onChange={(e) => {
                        handleOnChange({
                          name: "isVisible",
                          value: e.target.checked,
                          index: index,
                        });
                      }}
                      size="sm"
                      checked={item.isVisible}
                      defaultChecked={item.isVisible}
                    />
                  </FormControl>
                ))}
              </Stack>
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
    </Box>
  );
};

export default FieldsMenu;
