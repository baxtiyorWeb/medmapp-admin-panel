import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  type?: "success" | "error";
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title = "Muvaffaqiyatli!",
  message = "Murojaatingiz qabul qilindi! Tez orada operatorlarimiz siz bilan bog‘lanishadi.",
  type = "success",
}) => {
  if (!isOpen) return null;

  // Stillar uchun o'zgaruvchilar
  const modalOverlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    opacity: isOpen ? 1 : 0,
    visibility: isOpen ? "visible" : "hidden",
    transition: "all 0.3s ease",
  };

  const modalContentStyle: React.CSSProperties = {
    position: "fixed",
    right: "35%",
    top: "30%",
    padding: "2.5rem",
    borderRadius: "1rem",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    maxWidth: "420px",
    width: "100%",
    boxSizing: "border-box",
    transform: isOpen ? "scale(1)" : "scale(0.95)",
    transition: "transform 0.3s ease",
    backgroundColor: "#fff", // Oq fon
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "1.75rem",
    fontWeight: 700,
    color: "#212529",
    margin: "0 0 0.75rem 0",
  };

  const messageStyle: React.CSSProperties = {
    fontSize: "1rem",
    color: "#495057",
    lineHeight: 1.6,
    margin: "0 0 2rem 0",
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: "#007bff",
    color: "white",
    fontWeight: 600,
    padding: "0.875rem 2rem",
    borderRadius: "0.5rem",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    width: "100%",
    fontSize: "1rem",
  };

  const iconContainerStyle: React.CSSProperties = {
    marginBottom: "1.5rem",
  };

  const iconBaseStyle: React.CSSProperties = {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
  };

  const successIconStyle: React.CSSProperties = {
    ...iconBaseStyle,
    backgroundColor: "#e8f5e9", // Och yashil
  };

  const errorIconStyle: React.CSSProperties = {
    ...iconBaseStyle,
    backgroundColor: "#fdeaea", // Och qizil
  };

  const successSvgStyle: React.CSSProperties = {
    width: "40px",
    height: "40px",
    color: "#4caf50", // Yashil
    transition: "all 0.3s ease",
  };

  const errorSvgStyle: React.CSSProperties = {
    width: "40px",
    height: "40px",
    color: "#e63946", // Qizil
    transition: "all 0.3s ease",
  };

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <div style={iconContainerStyle}>
          <div style={type === "success" ? successIconStyle : errorIconStyle}>
            {type === "success" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={successSvgStyle}
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={errorSvgStyle}
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            )}
          </div>
        </div>
        <h2 style={titleStyle}>{title}</h2>
        <p style={messageStyle}>{message}</p>
        <button id="modal-close-btn" style={buttonStyle} onClick={onClose}>
          Yopish
        </button>
      </div>
    </div>
  );
};

export default Modal;
