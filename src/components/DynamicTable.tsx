"use client";

import React, { useEffect } from "react";
import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { tableState } from "@/recoil/atoms/tableState";
import { headerState } from "@/recoil/atoms/headerState";

const DynamicTable = () => {
  const headers = useRecoilValue(headerState);
  const tableData = useRecoilValue(tableState);

  return (
    <TableContainer minH={"md"}>
      <Table variant="simple" data-testid="table">
        <Thead data-testid="table-header">
          <Tr data-testid="table-header-row">
            {headers.map((header, index) => (
              <Th key={index}>{header}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody data-testid="table-body">
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
