import { useEffect } from "react";

const ToastMessage = ({
  show,
  message,
  type = "info",
  onClose,
  position = "bottom-end", // opções: top-end, top-start, bottom-end, bottom-start
  duration = 3000
}) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  const getBgColor = (type) => {
    switch (type) {
      case "success":
        return "bg-success text-white";
      case "error":
        return "bg-danger text-white";
      case "warning":
        return "bg-warning text-dark";
      default:
        return "bg-primary text-white";
    }
  };

  if (!show) return null;

  // Define posição com classes Bootstrap utilitárias
  const positionClass = {
    "top-start": "top-0 start-0",
    "top-end": "top-0 end-0",
    "bottom-start": "bottom-0 start-0",
    "bottom-end": "bottom-0 end-0",
  }[position] || "bottom-end";

  return (
    <div className={`position-fixed p-3 ${positionClass}`} style={{ zIndex: 1080 }}>
      <div
        className={`toast align-items-center show ${getBgColor(
          type
        )} border-0 shadow`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="d-flex">
          <div className="toast-body">{message}</div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            onClick={onClose}
          ></button>
        </div>
      </div>
    </div>
  );
}

export default ToastMessage;