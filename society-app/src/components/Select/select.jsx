import React from "react";
import { Select, MenuItem, Input } from "@mui/material";
import "./select.css";

const SelectOption = React.memo(({ field, value, onChange }) => {
  return !["0"].includes(value) ? (
    <Input
      value={value === "Other" ? "" : value}
      onChange={(e) => onChange(field, e.target.value)}
      fullWidth
      className="Val"
    />
  ) : (
    <Select
      value={["0", "1000", "5000", "10000"].includes(value) ? value : "Other"}
      onChange={(e) => {
        const val = e.target.value;
        onChange(field, val); // Set "" to trigger input
      }}
      className="select"
      fullWidth
    >
      <MenuItem value="0">0</MenuItem>
      <MenuItem value="1000">1000</MenuItem>
      <MenuItem value="5000">5000</MenuItem>
      <MenuItem value="10000">10000</MenuItem>
      <MenuItem value="Other">Other</MenuItem>
    </Select>
  );
});

export default SelectOption;
