"use client";
import Image from "next/image";
import styles from "./page.module.css";
import TableComponent from "@/components/TableComponent";
import { sampleData } from "@/lib/sampleData";
import { RecoilState, useRecoilState } from "recoil";
import { tableState } from "@/recoil/tableState";
import { ChangeEvent, useEffect, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Box, Button, Container, Flex, Switch } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from "@chakra-ui/react";
import SortDataComponent from "@/components/SortDataComponent";
import { headerState } from "@/recoil/headerState";

const getAllFields = (data: Record<string, any>[]) => {
  let allFields = {} as Record<string, boolean>;
  data.forEach((item) => {
    allFields = { ...allFields, ...item };
  });
  console.log(Object.keys(allFields));
  for (const key in allFields) {
    allFields[key] = true;
  }

  return allFields;
};

const getVisibleFields = (data: Record<string, boolean>) => {
  let visibleFields = [] as string[];

  for (const key in data) {
    if (data[key]) {
      visibleFields = [...visibleFields, key];
    }
  }
  return visibleFields;
};

export default function Home() {
  const [tableData, setTableData] = useRecoilState(tableState);
  const [visibleFields, setVisibleFiels] = useRecoilState(headerState);
  const [fields, setFields] = useLocalStorage(
    "fields",
    {} as Record<string, boolean>
  );

  const handleOnChangeFields = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    console.log("e.target", name, checked);
    let updatedFields = { ...fields };

    if (checked) {
      updatedFields[name] = true;
    } else {
      updatedFields[name] = false;
    }
    setFields(updatedFields);
  };

  useEffect(() => {
    setTableData(sampleData);
    const newFields = getAllFields(sampleData);
    if (!Object.keys(fields).length) {
      setFields(newFields);
    }
  }, []);

  useEffect(() => {
    const visibleFields = getVisibleFields(fields);
    setVisibleFiels(visibleFields);
  }, [fields]);

  return (
    <main className={styles.main}>
      <Container maxW={"2xl"}>
        <Flex gap={4}>
          <Menu>
            <MenuButton as={Button} leftIcon={<HamburgerIcon />}>
              Fields
            </MenuButton>
            <MenuList>
              {Object.keys(fields).map((field, index) => (
                <MenuItem key={index}>
                  <Flex width={"100%"} gap={4} justifyContent={"space-between"}>
                    <span>{field}</span>{" "}
                    <Switch
                      name={field}
                      onChange={handleOnChangeFields}
                      size="sm"
                      checked={fields[field]}
                      defaultChecked={fields[field]}
                    />
                  </Flex>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <SortDataComponent />
        </Flex>

        <TableComponent headers={visibleFields} />
      </Container>
    </main>
  );
}
