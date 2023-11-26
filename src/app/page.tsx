"use client";
import styles from "./page.module.css";
import { sampleData } from "@/lib/sampleData";
import { useSetRecoilState } from "recoil";
import { tableState } from "@/recoil/atoms/tableState";
import { useEffect } from "react";
import { Container, Flex } from "@chakra-ui/react";
import FieldsMenu from "@/components/FieldsMenu";
import DynamicTable from "@/components/DynamicTable";
import FilterMenu from "@/components/FilterMenu";
import SortMenu from "@/components/SortMenu";
import { dynamicDataState } from "@/recoil/atoms/dynamicDataState";

export default function Home() {
  const setTableData = useSetRecoilState(tableState);
  const setDynamicData = useSetRecoilState(dynamicDataState);

  useEffect(() => {
    setTableData(sampleData);
    setDynamicData(sampleData);
  }, []);

  return (
    <main>
      <Container py={8} maxW={"container.xl"}>
        <Flex
          gap={4}
          borderBottom={"1px solid"}
          borderColor={"gray.100"}
          pb={3}
        >
          <FieldsMenu />
          <FilterMenu />
          <SortMenu />
        </Flex>
        <DynamicTable />
      </Container>
    </main>
  );
}
