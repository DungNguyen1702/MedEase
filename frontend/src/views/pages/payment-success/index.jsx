import { CheckCircleOutlined } from "@ant-design/icons"
import "./index.scss";
import { useSearchParams } from "react-router-dom";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <>
      <div className="payment-success__container">
        <div className="payment-success__card">
          <div className="payment-success__content">
            <div className="payment-success__icon">
              <CheckCircleOutlined />
            </div>

            <div className="payment-success__message">
              <h1 className="payment-success__message-title">Thanh toán thành công!</h1>
              <p className="payment-success__message-subtitle">Cảm ơn bạn đã thanh toán</p>
            </div>

            <div className="payment-success__instructions">
              <div className="payment-success__instructions-header">
                <span>Hướng dẫn tiếp theo</span>
              </div>
              <p className="payment-success__instructions-text">
                Vui lòng quay lại màn hình ứng dụng để cập nhật trạng thái cuộc hẹn của bạn
              </p>
            </div>

            <div className="payment-success__details">
              <div className="payment-success__details-row">
                <span className="payment-success__details-row-label">Mã giao dịch:</span>
                <span className="payment-success__details-row-value payment-success__details-row-value--mono">
                  {orderId || "Không có mã giao dịch"}
                </span>
              </div>
              <div className="payment-success__details-row">
                <span className="payment-success__details-row-label">Thời gian:</span>
                <span className="payment-success__details-row-value">{new Date().toLocaleString("vi-VN")}</span>
              </div>
              <div className="payment-success__details-row">
                <span className="payment-success__details-row-label">Trạng thái:</span>
                <span className="payment-success__details-row-value payment-success__details-row-value--success">
                  Thành công
                </span>
              </div>
            </div>

            <div className="payment-success__support">
              <p className="payment-success__support-text">
                Nếu có vấn đề, vui lòng liên hệ hỗ trợ:
                <span className="payment-success__support-text-phone"> 0905116391</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
