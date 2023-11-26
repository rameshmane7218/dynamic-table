"use client";

import React, { useEffect } from "react";
import {
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import { tableState } from "@/recoil/atoms/tableState";
import { SortType, sortState } from "@/recoil/atoms/sortState";
import { headerState } from "@/recoil/atoms/headerState";


const DynamicTable = () => {
  const headers = useRecoilValue(headerState);

  const [tableData, setTableData] = useRecoilState(tableState);
  const [sortSettings, setSortSettings] = useRecoilState(sortState);

  // useEffect(() => {
  //   const sortedData = handleSortData(tableData, sortSettings);
  // }, [sortSettings]);
  return (
    <TableContainer minH={"md"}>
      <Table variant="simple">
        <Thead>
          <Tr>
            {headers.map((header, index) => (
              <Th key={index}>{header}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {tableData.map((row, index) => (
            <Tr key={index}>
              {headers.map((header, idx) => (
                <Td key={idx}>{row[header]}</Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default DynamicTable;
