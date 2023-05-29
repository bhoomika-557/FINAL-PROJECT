import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { number } from "yup";
import { useParams } from "react-router-dom";
import axios from "axios";
import { URL } from "../../constants/config";
import DownloadXL from "../../components/download";
import useAuth from "../../hooks/useAuth";

const columns = [
  { field: "COMPANY_NAME", headerName: "COMPANY NAME", width: 200 },

  { field: "CTC", headerName: "PACKAGE", width: 200, type: "number" },
  { field: "CAMPUS_TYPE", headerName: "CAMPUS TYPE", width: 200 },
  { field: "SELECTED_DATE", headerName: "SELECTED DATE", width: 200 },
];

function CompanyWiseSelected() {
  const { academicYear, auth } = useAuth();

  const { regNo } = useParams();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetchCompanyList();
  }, [regNo, academicYear]);

  const fetchCompanyList = async () => {
    const result = await axios.get(URL + `/students/${regNo}`);
    setRows(() => {
      const data = result.data.result.SELECTED_COMPANY_DETAILS || [];
      return data;
    });
  };

  return (
    <div style={{ height: 625, width: "100%" }}>
      {/* <h1 className="text-3xl mb-5 ">Selected Companies of {regNo}</h1> */}
      <div className="flex flex-row justify-between items-center w-full mb-5">
        <h1 className="text-3xl">Selected Companies of {regNo}</h1>
        {auth.ROLE === "ADMIN" && <DownloadXL row={rows} />}
      </div>
      {rows ? (
        <DataGrid getRowId={(row) => row._id} rows={rows} columns={columns} />
      ) : (
        "Loading..."
      )}
    </div>
  );
}

export default React.memo(CompanyWiseSelected);
