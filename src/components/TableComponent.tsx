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
import { useRecoilState } from "recoil";
import { tableState } from "@/recoil/tableState";
import { SortType, sortState } from "@/recoil/sortState";

const handleSortData = (
  tableData: Record<string, any>[],
  sortSettings: SortType[]
) => {
  const sortedData = [...tableData];
  sortedData.sort((a, b) => {
    const condition = [];
    let sortCondition = sortSettings.map((sortItem) => {
      if (sortItem.type == "asc") {
        condition.push(a[sortItem.field] - b[sortItem.field]);
      } else {
        condition.push(b[sortItem.field] - a[sortItem.field]);
      }
    });

    console.log("sortCondition", sortCondition);
    return 1;
  });
};

const TableComponent = ({ headers = [] }: { headers: string[] }) => {
  const [tableData, setTableData] = useRecoilState(tableState);
  const [sortSettings, setSortSettings] = useRecoilState(sortState);

  useEffect(() => {
    const sortedData = handleSortData(tableData, sortSettings);
  }, [sortSettings]);
  return (
    <TableContainer>
      <Table variant="simple">
        {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
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

export default TableComponent;
