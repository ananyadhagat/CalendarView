import React, { useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  titleId?: string;
  descId?: string;
  children: React.ReactNode;
};

export const Modal: React.FC<Props> = ({ open, onClose, titleId = "modal-title", descId = "modal-desc", children }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" aria-hidden onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descId}
          className="w-full max-w-lg rounded-xl bg-white shadow-modal p-4"
        >
          {children}
        </div>
      </div>
    </div>
  );
};
