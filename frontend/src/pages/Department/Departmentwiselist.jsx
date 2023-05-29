import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { URL } from "../../constants/config";
import DownloadXL from "../../components/download";
import useAuth from "../../hooks/useAuth";

const columns = [
  { field: "_id", headerName: "DEPARTMENT", width: 200 },
  {
    field: "count",
    headerName: "NO.OF SELECTIONS",
    width: 200,
    type: "number",
  },
];

export default function Departmentwiselist() {
  const { academicYear, auth } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetchCompanyList();
  }, [academicYear]);

  const fetchCompanyList = async () => {
    const result = await axios.get(URL + "/department-wise-list");
    setRows(result.data.result);
  };

  const handleRowClick = ({ row }) => {
    navigate(`/each-department-selected/${row._id}`);
  };

  return (
    <div style={{ height: 625, width: "100%" }}>
      <div className="flex flex-row justify-between items-center w-full mb-5">
        <h1 className="text-3xl">Department wise placements</h1>
        {auth.ROLE === "ADMIN" && <DownloadXL row={rows} />}
      </div>
      {rows ? (
        <DataGrid
          getRowId={(row) => row._id}
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
