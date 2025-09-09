// components/CustomDropdown.js
import React, { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";

export default function CustomDropdown({
  value,
  setValue,
  items,
  placeholder,
  zIndex,
}) {
  const [open, setOpen] = useState(false);

  return (
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      placeholder={placeholder}
      listMode="SCROLLVIEW"
      zIndex={zIndex}
    />
  );
}
