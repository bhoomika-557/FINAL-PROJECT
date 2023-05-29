import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { URL } from "../../constants/config";
import { useNavigate } from "react-router-dom";
import DownloadXL from "../../components/download";
import useAuth from "../../hooks/useAuth";

const columns = [
  { field: "REG_NO", headerName: "REGISTER No", width: 200 },
  { field: "NAME_OF_THE_STUDENT", headerName: "STUDENT NAME", width: 200 },
  { field: "GENDER", headerName: "GENDER", width: 200 },
  { field: "BRANCH", headerName: "BRANCH", width: 200 },
  { field: "EMAIL", headerName: "EMAIL ID", width: 200 },
  { field: "MOBILE", headerName: "MOBILE No", width: 200 },
  { field: "ADDRESS", headerName: "ADDRESS", width: 200 },
  { field: "ACADEMIC_YEAR", headerName: "ACADEMIC YEAR", width: 200 },

  { field: "COMPANY_NAME", headerName: "COMPANY NAME", width: 200 },
  { field: "CTC", headerName: "PACKAGE", width: 200 },
  { field: "CAMPUS_TYPE", headerName: "CAMPUS TYPE", width: 200 },
  { field: "SELECTED_DATE", headerName: "SELECTED DATE", width: 200 },
];

export default function PlacementSheet() {
  const { academicYear, auth } = useAuth();

  const navigate = useNavigate();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetchStudentList();
  }, [academicYear]);

  const fetchStudentList = async () => {
    const result = await axios.post(URL + "/total-placement/list", {
      academicYear: "2022-2023",
    });
    setRows(result.data.result);
  };

  return (
    <div style={{ height: 625, width: "100%" }}>
      <div className="flex flex-row justify-between items-center w-full mb-5">
        <h1 className="text-3xl">List of ASGI Selected Students</h1>
        {auth.ROLE === "ADMIN" && <DownloadXL row={rows} />}
      </div>
      {rows ? (
        <DataGrid
          getRowId={(row) => row.REG_NO + row.EMAIL + row.MOBILE}
          rows={rows}
          columns={columns}
        />
      ) : (
        "Loading..."
      )}
    </div>
  );
}
