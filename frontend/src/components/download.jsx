import React from "react";
import { Button } from "@mui/material";
import { Col } from "reactstrap";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import * as XLSX from "xlsx";

function DownloadXL(props) {
  const handledownload = () => {
    var var1 = XLSX.utils.book_new();
    var var2 = XLSX.utils.json_to_sheet(props.row);

    XLSX.utils.book_append_sheet(var1, var2, "My first sheet");

    XLSX.writeFile(var1, "MyExcel.xlsx");
  };

  return (
    <div>
      <div>
        <div md={12}>
          <Button
            sx={{
              backgroundColor: "rgb(13, 21, 104)",
              color: "aliceblue",
              "&:hover": { backgroundColor: "aliceblue", color: "black" },
            }}
            variant="contained"
            onClick={handledownload}
            className="border-hidden bg-indigo-800 m-5 p-3 h-11 text-l text-slate-100 rounded-xl w-40"
          >
            <FileDownloadIcon /> DOWNLOAD
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DownloadXL;
