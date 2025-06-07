import React from "react";

const CustomModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "",
  message = "",
  type = "alert", // 'alert' | 'confirm'
  confirmText = "OK",
  cancelText = "Cancel",
}) => {
  if (!isOpen) return null;

  const isConfirm = type === "confirm";
  const isSuccess = title.toLowerCase().includes("success"); // Check if title has "Success" to show green tick

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        display: "flex",
        alignItems: "center", // Always center
        justifyContent: "center",
        zIndex: 1000,
        padding: "16px",
      }}
    >
      <div
        style={{
          backgroundColor: "white", // Always white, even for success
          padding: "20px",
          borderRadius: "8px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
      >
        {isSuccess && (
          <svg
            style={{
              width: "40px",
              height: "40px",
              color: "#10b981",
              marginBottom: "8px",
            }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
        <h3
          style={{
            fontSize: "16px",
            fontWeight: "600",
            color: isSuccess ? "#065f46" : "#1f2937",
            marginBottom: "8px",
            textAlign: "center",
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: "14px",
            color: isSuccess ? "#065f46" : "#4b5563",
            marginBottom: "40px",
            textAlign: "center",
          }}
        >
          {message}
        </p>

        <div
          style={{
            position: isSuccess ? "absolute" : "static",
            bottom: isSuccess ? "10px" : "auto",
            left: 0,
            right: 0,
            display: "flex",
            flexDirection:
              window.innerWidth < 640 && isConfirm ? "column" : "row",
            justifyContent: isConfirm ? "flex-end" : "center",
            gap: "8px",
            padding: "0 16px",
          }}
        >
          {isConfirm && (
            <button
              onClick={onClose}
              style={{
                padding: "8px 16px",
                fontSize: "14px",
                fontWeight: "500",
                borderRadius: "4px",
                backgroundColor: "#e5e7eb",
                color: "#1f2937",
                border: "none",
                cursor: "pointer",
                minWidth: "80px",
              }}
            >
              {cancelText}
            </button>
          )}

          <button
            onClick={isConfirm && onConfirm ? onConfirm : onClose}
            style={{
              padding: "8px 16px",
              fontSize: "14px",
              fontWeight: "500",
              borderRadius: "4px",
              backgroundColor: isSuccess ? "#10b981" : "#4f46e5",
              color: "white",
              border: "none",
              cursor: "pointer",
              minWidth: "80px",
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
