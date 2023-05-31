import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { URL } from "../../constants/config";
import { useNavigate, useParams } from "react-router-dom";
import DownloadXL from "../../components/download";
import useAuth from "../../hooks/useAuth";

const columns = [
  { field: "REG_NO", headerName: "REGISTER No", width: 200 },
  { field: "NAME_OF_THE_STUDENT", headerName: "STUDENT NAME", width: 200 },
  { field: "GENDER", headerName: "GENDER", width: 200 },
  // { field: "COLLEGE", headerName: "COLLEGE", width: 200 },
  { field: "BRANCH", headerName: "BRANCH", width: 200 },
  {
    field: "NO_OF_OFFERS",
    headerName: "NO. OF OFFERS",
    width: 200,
  },
  { field: "EMAIL", headerName: "EMAIL ID", width: 200 },
  { field: "MOBILE", headerName: "MOBILE No", width: 200 },
  { field: "ADDRESS", headerName: "ADDRESS", width: 200 },

  // { field: "HIGHEST_PACKAGE", headerName: "HIGHEST PACKAGE", width: 200 },
  // {
  //   field: "HIGHEST_PACKAGE_COMPANY",
  //   headerName: "HIGHEST PACKAGE COMPANY",
  //   width: 200,
  // },
  // { field: "LOWEST_PACKAGE", headerName: "LOWEST PACKAGE", width: 200 },
  // {
  //   field: "LOWEST_PACKAGE_COMPANY",
  //   headerName: "LOWEST PACKAGE COMPANY",
  //   width: 200,
  // },
];

export default function BranchWiseStudents() {
  const { academicYear, auth } = useAuth();
  const { department } = useParams();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetchStudentList();
  }, [department, academicYear]);

  const fetchStudentList = async () => {
    const result = await axios.get(
      URL + `/departmet-specific-list/${department}`
    );
    setRows(result.data.result);
    // console.log(setRows);
  };

  return (
    <div style={{ height: 625, width: "100%" }}>
      <div className="flex flex-row justify-between items-center w-full mb-5">
        <h1 className="text-3xl">List of Selected Students</h1>
        {auth.ROLE === "ADMIN" && <DownloadXL row={rows} />}
      </div>
      {rows ? (
        <DataGrid
          getRowId={(row) => row.REG_NO + row.EMAIL}
          rows={rows}
          columns={columns}
        />
      ) : (
        "Loading..."
      )}
    </div>
  );
}
