"use client";
import { sampleData } from "@/lib/sampleData";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { tableState } from "@/recoil/atoms/tableState";
import { useEffect, useState } from "react";
import { Container, Flex } from "@chakra-ui/react";
import FieldsMenu from "@/components/FieldsMenu";
import DynamicTable from "@/components/DynamicTable";
import FilterMenu from "@/components/FilterMenu";
import SortMenu from "@/components/SortMenu";
import { dynamicDataState } from "@/recoil/atoms/dynamicDataState";
import { FieldType, fieldState } from "@/recoil/atoms/fieldState";
import { localStorageKeys } from "@/recoil/constant";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { SortType, sortState } from "@/recoil/atoms/sortState";
import { FilterType, filterState } from "@/recoil/atoms/filterState";
import { dynamicDataInfo } from "@/recoil/selectors/tableSelector";

export default function Home() {
  const setTableData = useSetRecoilState(tableState);
  const setDynamicData = useSetRecoilState(dynamicDataState);
  const dynamicDataInfoValue = useRecoilValue(dynamicDataInfo);

  const [loading, setLoading] = useState(true);
  const [localFieldSettings] = useLocalStorage<FieldType[]>(
    localStorageKeys.fields,
    []
  );
  const [localFilterSettings] = useLocalStorage<FilterType[]>(
    localStorageKeys.filterSettings,
    []
  );
  const [localSortSettings] = useLocalStorage<SortType[]>(
    localStorageKeys.sortSettings,
    []
  );
  const [fieldSettings, setFieldSettings] = useRecoilState(fieldState);
  const [filterSettings, setFilterSettings] = useRecoilState(filterState);
  const [sortSettings, setSortSettings] = useRecoilState(sortState);

  useEffect(() => {
    // setTableData(sampleData);
    setDynamicData(sampleData);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!fieldSettings.length) {
      if (localFieldSettings.length) {
        setFieldSettings(localFieldSettings);
      } else {
        setFieldSettings(dynamicDataInfoValue.fields);
      }
    }
  }, [localFieldSettings, dynamicDataInfoValue]);

  useEffect(() => {
    if (!filterSettings.length) {
      setFilterSettings(localFilterSettings);
    }
  }, [localFilterSettings]);

  useEffect(() => {
    if (!sortSettings.length) {
      setSortSettings(localSortSettings);
    }
  }, [localSortSettings]);


  return (
    <main>
      <Container py={8} maxW={"container.xl"}>
        {loading ? null : (
          <>
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
          </>
        )}
      </Container>
    </main>
  );
}
