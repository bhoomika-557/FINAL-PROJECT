import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { URL } from "../../constants/config";
import { useNavigate } from "react-router-dom";
// import { Row, Button, Col } from "reactstrap";
// import * as XLSX from "xlsx";
import DownloadXL from "../../components/download";
import useAuth from "../../hooks/useAuth";
const columns = [
  { field: "COMPANY_NAME", headerName: "COMPANY NAME", width: 200 },
  {
    field: "SELECTED_COUNT",
    headerName: "NO.OF SELECTIONS",
    width: 200,
    type: "number",
  },
  { field: "CTC", headerName: "CTC", width: 200, type: "number" },
  { field: "CAMPUS_TYPE", headerName: "ON/OFF", width: 200 },
];

export default function CompanyList() {
  const { academicYear, auth } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState();

  useEffect(() => {
    fetchCompanyList();
  }, [academicYear]);

  const fetchCompanyList = async () => {
    // console.log("xxxx", auth);
    const result = await axios.get(URL + "/company/list");
    setRows(result.data.company_list);
    console.log(result);
    console.log(rows);
  };

  const handleRowClick = ({ row }) => {
    navigate(`/company-wise-selected/${row.COMPANY_NAME}`);
  };

  return (
    <div style={{ height: 625, width: "100%" }}>
      <div className="flex flex-row justify-between items-center mb-5">
        <h1 className="text-3xl ">List of Companies</h1>
        {auth.ROLE === "ADMIN" && <DownloadXL row={rows} />}
      </div>

      {rows ? (
        <DataGrid
          getRowId={(row) => row.SELECTED_COUNT + row.COMPANY_NAME}
          rows={rows}
          columns={columns}
          onRowClick={handleRowClick}
        />
      ) : (
        "Loading..."
      )}
    </div>
  );
}
