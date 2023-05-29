import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { number } from "yup";
import { useParams } from "react-router-dom";
import axios from "axios";
import { URL } from "../../constants/config";
import DownloadXL from "../../components/download";
import useAuth from "../../hooks/useAuth";

const columns = [
  { field: "REG_NO", headerName: "REGISTER NO.", width: 125 },
  {
    field: "NAME_OF_THE_STUDENT",
    headerName: "STUDENT NAME",
    width: 150,
  },
  // { field: "COLLEGE", headerName: "COLLEGE", width: 100 },
  { field: "GENDER", headerName: "GENDER", width: 100 },
  { field: "BRANCH", headerName: "BRANCH", width: 100 },
  { field: "EMAIL", headerName: "EMAIL", width: 250 },
  {
    field: "MOBILE",
    headerName: "MOBILE",
    width: 100,
    type: number,
  },
  {
    field: "NO. OF OFFERS",
    headerName: "NO_OF_OFFERS",
    width: 200,
    type: number,
  },
  {
    field: "SELECTED_DATE",
    headerName: "SELECTED DATE",
    width: 100,
  },
  {
    field: "CTC",
    headerName: "PACKAGE",
    width: 80,
    type: number,
  },
  {
    field: "CAMPUS_TYPE",
    headerName: "CAMPUS TYPE",
    width: 100,
  },
  { field: "ADDRESS", headerName: "ADDRESS", width: 200 },
];

export default function CompanyWiseSelected() {
  const { academicYear, auth } = useAuth();

  const { company } = useParams();
  const [rows, setRows] = useState();

  useEffect(() => {
    fetchCompanyList();
  }, [company, academicYear]);

  const fetchCompanyList = async () => {
    const result = await axios.get(URL + `/company/single/${company}`);
    setRows(() => {
      const data = result.data.result.map(
        ({ SELECTED_COMPANY_DETAILS, PERSONAL_DETAILS, REG_NO }) => {
          return {
            REG_NO,
            NAME_OF_THE_STUDENT: PERSONAL_DETAILS?.NAME_OF_THE_STUDENT,
            GENDER: PERSONAL_DETAILS?.GENDER,
            BRANCH: PERSONAL_DETAILS?.BRANCH,
            EMAIL: PERSONAL_DETAILS?.EMAIL,
            MOBILE: PERSONAL_DETAILS?.MOBILE,
            SELECTED_DATE: SELECTED_COMPANY_DETAILS[0]?.SELECTED_DATE,
            CTC: SELECTED_COMPANY_DETAILS[0]?.CTC,
            CAMPUS_TYPE: SELECTED_COMPANY_DETAILS[0]?.CAMPUS_TYPE,
            ADDRESS: PERSONAL_DETAILS?.ADDRESS,
            old: { ...result.data.result },
          };
        }
      );
      return data;
    });
  };

  return (
    <div style={{ height: 625, width: "100%" }}>
      {/* <h1 className="text-3xl mb-5 ">Selected Students for {company}</h1> */}
      <div className="flex flex-row justify-between items-center mb-5">
        <h1 className="text-3xl ">Selected Students for {company}</h1>
        {auth.ROLE === "ADMIN" && <DownloadXL row={rows} />}
      </div>
      {rows ? (
        <DataGrid
          getRowId={(row) => row.REG_NO}
          rows={rows}
          columns={columns}
        />
      ) : (
        "Loading..."
      )}
    </div>
  );
}
