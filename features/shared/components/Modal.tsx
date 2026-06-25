"use client";

import { X } from "lucide-react";

type ModalProps = {

  open: boolean;

  onClose: () => void;

  children: React.ReactNode;

};

export default function Modal({
  open,
  onClose,
  children,
}: ModalProps) {

  if (!open) return null;

  return (

    <div
      className="
        fixed inset-0
        z-50
        flex items-center justify-center
        bg-black/40
        backdrop-blur-sm
        p-5
      "
    >

      {/* Modal */}
      <div
        className="
          relative
          w-full max-w-lg
          bg-white
          rounded-[32px]
          p-7
          shadow-2xl
          animate-in fade-in zoom-in
        "
      >

        {/* Close */}
        <button
          onClick={onClose}
          className="
            absolute
            top-5 left-5
            w-10 h-10
            rounded-2xl
            bg-gray-100
            flex items-center justify-center
            hover:bg-gray-200
            transition-all
          "
        >

          <X size={18} />

        </button>

        {/* Content */}
        {children}

      </div>

    </div>

  );

}