import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { URL } from "../../constants/config";
import { useNavigate } from "react-router-dom";
import DownloadXL from "../../components/download";
import useAuth from "../../hooks/useAuth";

const columns = [
  { field: "REG_NO", headerName: "REGISTER NO.", width: 200 },
  { field: "NAME_OF_THE_STUDENT", headerName: "STUDENT NAME", width: 250 },
  { field: "GENDER", headerName: "GENDER", width: 150 },
  { field: "BRANCH", headerName: "BRANCH", width: 150 },
  { field: "EMAIL", headerName: "EMAIL ID", width: 200 },
  { field: "MOBILE", headerName: "MOBILE No", width: 200 },
  { field: "ADDRESS", headerName: "ADDRESS", width: 200 },
  { field: "NO_OF_OFFERS", headerName: "NO OF OFFERS", width: 150 },
  { field: "HIGHEST_PACKAGE", headerName: "HIGHEST PACKAGE", width: 200 },
  {
    field: "HIGHEST_PACKAGE_COMPANY",
    headerName: "HIGHEST_PACKAGE_COMPANY",
    width: 200,
  },
  { field: "LOWEST_PACKAGE", headerName: "LOWEST PACKAGE", width: 200 },
  {
    field: "LOWEST_PACKAGE_COMPANY",
    headerName: "LOWEST PACKAGE COMPANY",
    width: 200,
  },
];

export default function AllPlacementStudents() {
  const { academicYear, auth } = useAuth();

  const navigate = useNavigate();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetchStudentList();
  }, [academicYear]);

  const fetchStudentList = async () => {
    const result = await axios.get(URL + "/students/list");
    setRows(result?.data?.selected_students);
  };

  const handleRowClick = ({ row }) => {
    navigate(`/students/${row.REG_NO}`);
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
          onRowClick={handleRowClick}
        />
      ) : (
        "Loading..."
      )}
    </div>
  );
}
