import React from "react";
import { Input } from "antd";
import "./index.scss";

function InputComponent({
  placeholder,
  value,
  setValue,
  type = "text",
  className,
}) {
  return (
    <>
      {type === "text" ? (
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={`inputValue ${className}`}
        />
      ) : (
        <Input.Password
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={`inputValue ${className}`}
        />
      )}
    </>
  );
}

export default InputComponent;
