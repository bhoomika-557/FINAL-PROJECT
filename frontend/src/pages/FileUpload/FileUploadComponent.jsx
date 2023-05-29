import React, { useState, useMemo, useEffect } from "react";
import { Uploader } from "uploader";
import { Button } from "@mui/material";
import Autocompletebox from "../../components/autocomplete";
import AlertDialog from "../../components/alertdialogbox";
import axios from "axios";
import { URL } from "../../constants/config";
import LinearProgress from "@mui/material/LinearProgress";

const collectionsOptions = [
  { label: "Placement", value: "PLACEMENT" },
  { label: "Credentials", value: "CREDENTIALS" },
  { label: "Student", value: "STUDENT" },
];

function FileUploadComponent() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState();
  const [collection, setCollection] = useState({});
  const [loading, setLoading] = useState(false);

  const savebuttonclick = () => {
    setOpen(true);
  };

  const handleNotOk = () => {
    setOpen(false);
  };

  const handleOk = async () => {
    setOpen(false);
    const formData = new FormData();
    formData.append("sheet", file);
    formData.append("collection", collection);
    if (collection.value === "PLACEMENT") {
      const result = await axios.post(URL + "/file-upload/placement", formData);
    }
    if (collection.value === "CREDENTIALS") {
      formData.delete("collection");
      const result = await axios.post(URL + "/register", formData);
    }

    if (collection.value === "STUDENT") {
      formData.delete("collection");
      const result = await axios.post(URL + "/file-upload/student", formData);
    }
  };

  useEffect(() => {
    if (file) {
      setLoading(true);

      const xhr = new XMLHttpRequest();

      xhr.onloadend = () => {
        setLoading(false);
      };

      xhr.open("GET", file);
      xhr.send();
    }
  }, [file]);

  const handleFileUpload = (e) => {
    setFile(e?.target?.files[0]);
  };
  console.log("SUCCESS");
  return (
    <div>
      {loading && <LinearProgress className="m-auto w-1/2" />}
      <div className=" border-dashed border rounded-md border-gray-300 w-1/2 h-96 m-auto flex justify-center items-center mb-7">
        <input
          type="file"
          id="file"
          className="hidden cursor-pointer"
          onChange={handleFileUpload}
        />

        <label
          for="file"
          className="w-48 h-12  rounded-md bg-blue-600 text-white flex justify-center items-center"
        >
          UPLOAD A FILE
        </label>
      </div>
      <div className=" w-1/2 my-4 mx-auto text-center text-bold font-xl">
        {file && !loading && <>Uplaoded file is {file?.name} </>}
      </div>
      <div className="flex justify-between items-center w-1/2 m-auto">
        <Autocompletebox
          label={"Selected the collection"}
          options={collectionsOptions}
          handler={(event, value) => {
            setCollection(value || {});
          }}
        />
        <div>
          <Button
            variant="contained"
            disabled={!file || !Object?.keys(collection)?.length}
            onClick={savebuttonclick}
          >
            save
          </Button>
          {open && (
            <AlertDialog
              open={open}
              handleNotOk={handleNotOk}
              handleOk={handleOk}
              message={"Do you want to save the data ?"}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default FileUploadComponent;
