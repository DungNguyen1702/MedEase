import "bootstrap/dist/css/bootstrap.min.css";
import { ICONS } from "../../constants/icons";
import "./index.scss";

function NoData() {
  return (
    <div className="w-100 d-flex justify-content-center align-items-center my-4">
      <img alt="No data" src={ICONS.NoData} className="no-data-image" />
      <p className="no-data-text">Không có dữ liệu</p>
    </div>
  );
}

export default NoData;
