import React from "react";
import "./modal.css";

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

  return (
    <div id="status-modal" className="modal-overlay show" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // tashqarisini bossang yopilsin
      >
        <div id="modal-icon-container">
          <div className={type === "success" ? "success-icon" : "error-icon"}>
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
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            )}
          </div>
        </div>
        <h2 id="modal-title">{title}</h2>
        <p id="modal-message">{message}</p>
        <button id="modal-close-btn" className="modal-button" onClick={onClose}>
          Yopish
        </button>
      </div>
    </div>
  );
};

export default Modal;
