import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function Autocompletebox({
  defaultValue,
  label,
  options,
  handler,
  className,
}) {
  return (
    <Autocomplete
      defaultValue={defaultValue}
      onChange={handler}
      disablePortal
      id="combo-box-demo"
      options={options}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label={label} />}
      className={className}
    />
  );
}
