"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    isDestructive = false,
}: ConfirmModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        }
    }, [isOpen]);

    if (!mounted || !isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
            <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-xl max-w-md w-full overflow-hidden transform transition-all scale-100 opacity-100">
                <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        {title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                        {message}
                    </p>
                </div>
                <div className="bg-gray-50 dark:bg-zinc-800/50 px-6 py-4 flex justify-end gap-3 border-t border-gray-100 dark:border-zinc-700">
                    <button
                        onClick={onClose}
                        className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-700 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors ${isDestructive
                                ? "bg-red-600 hover:bg-red-500 focus-visible:ring-red-600"
                                : "bg-indigo-600 hover:bg-indigo-500 focus-visible:ring-indigo-600"
                            }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
