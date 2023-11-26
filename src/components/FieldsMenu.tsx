import React, { ChangeEvent, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Select,
  Stack,
  Switch,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { headerState } from "@/recoil/atoms/headerState";
import { dynamicDataInfo } from "@/recoil/selectors/tableSelector";
import isEqual from "lodash/isEqual";
import { ListIcon } from "lucide-react";

const getVisibleFields = (data: Record<string, boolean>) => {
  let visibleFields = [] as string[];

  for (const key in data) {
    if (data[key]) {
      visibleFields = [...visibleFields, key];
    }
  }
  return visibleFields;
};

const FieldsMenu = () => {
  const setVisibleFiels = useSetRecoilState(headerState);
  const dynamicDataInfoValue = useRecoilValue(dynamicDataInfo);

  const [fields, setFields] = useLocalStorage(
    "fields",
    {} as Record<string, boolean>
  );

  const handleOnChangeFields = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    let updatedFields = { ...fields };

    if (checked) {
      updatedFields[name] = true;
    } else {
      updatedFields[name] = false;
    }
    setFields(updatedFields);
  };

  useEffect(() => {
    const visibleFields = getVisibleFields(fields);
    setVisibleFiels(visibleFields);
  }, [fields]);

  useEffect(() => {
    if (
      !Object.keys(fields).length ||
      !isEqual(fields, dynamicDataInfoValue.headers)
    ) {
      setFields(dynamicDataInfoValue.headers);
    }
  }, [dynamicDataInfoValue]);

  return (
    <Box>
      <Popover placement="bottom-start">
        <PopoverTrigger>
          <Button leftIcon={<ListIcon width={"1em"} height={"1em"} />}>
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
              >
                {Object.keys(fields).map((field, index, arr) => (
                  <Flex
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
                    <span>{field}</span>{" "}
                    <Switch
                      name={field}
                      onChange={handleOnChangeFields}
                      size="sm"
                      checked={fields[field]}
                      defaultChecked={fields[field]}
                    />
                  </Flex>
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
