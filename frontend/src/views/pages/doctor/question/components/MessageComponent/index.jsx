import "./index.scss";
import { Avatar } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  formatDateToYYYYMMDDHHmm,
  formatRelativeTime,
} from "../../../../../../utils/stringUtil";

function MessageComponent({ content, sender, style = "left", createdAt }) {
  return (
    <div className="message-container">
      {style === "left" && (
        <Avatar
          src={sender?.avatar}
          alt="sender avatar"
          size={70}
          shape="square"
        />
      )}
      <div className="message-content-container">
        <p
          className={`message-sender-name w-100 ${
            style === "left" ? "text-start" : "text-end"
          }`}
        >
          {sender?.name}
        </p>
        <p
          className={`message-content w-100 ${
            style === "left" ? "text-start" : "text-end"
          }`}
        >
          {content}
        </p>
        <p
          className={`message-date w-100 ${
            style === "left" ? "text-end" : "text-start"
          }`}
        >
          {formatRelativeTime(createdAt)}
        </p>
      </div>
      {style !== "left" && (
        <Avatar
          src={sender?.avatar}
          alt="sender avatar"
          size={70}
          shape="square"
        />
      )}
    </div>
  );
}

export default MessageComponent;
