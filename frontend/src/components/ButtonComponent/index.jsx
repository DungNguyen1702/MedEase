import { Button } from "antd";
import React from "react";
import "./index.scss";

function ButtonComponent({
  onClick,
  content,
  className,
  styleButton = "light",
}) {
  return (
    <Button
      className={`${className} button-component${
        styleButton === "dark" ? "-dark" : ""
      }`}
      onClick={onClick}
    >
      {content}
    </Button>
  );
}

export default ButtonComponent;
