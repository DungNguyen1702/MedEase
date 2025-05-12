import "./index.scss";

const LoadingOverlay = ({ loading }) => {
  return (
    <div className={`loading-overlay ${loading ? "active" : ""}`}>
      <div className="loading-spinner"></div>
    </div>
  );
};

export default LoadingOverlay;
