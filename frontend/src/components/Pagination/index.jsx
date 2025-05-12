import { Pagination } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";

function PaginationComponent({ page, limit, total, setPage, setLimit }) {
  return (
    <div className="w-100 d-flex justify-content-center align-items-center my-2">
      <Pagination
        current={page}
        pageSize={limit}
        total={total}
        onChange={(page, pageSize) => {
          setPage(page);
          setLimit(pageSize);
        }}
        style={{ marginTop: 16, textAlign: "right" }}
      />
    </div>
  );
}

export default PaginationComponent;
