import React from "react";
import { Input } from "antd";
import "./index.scss";

function InputComponent({
  placeholder,
  value,
  setValue,
  type = "text",
  className,
  disabled = false, // Thêm prop disabled, mặc định là false (edit được)
}) {
  return (
    <>
      {type === "text" ? (
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={`inputValue ${className}`}
          disabled={disabled}
        />
      ) : (
        <Input.Password
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={`inputValue ${className}`}
          disabled={disabled}
        />
      )}
    </>
  );
}

export default InputComponent;
