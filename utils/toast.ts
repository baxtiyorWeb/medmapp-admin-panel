// utils/toast.ts
import { ToastMessage } from "@/types";

export const showToast = (
    setToasts: React.Dispatch<React.SetStateAction<ToastMessage[]>>,
    message: string,
    type: "success" | "danger" | "warning" = "success"
) => {
    const newToast: ToastMessage = { id: Date.now(), message, type };
    setToasts((prevToasts) => [...prevToasts, newToast]);
    setTimeout(() => {
        setToasts((prevToasts) =>
            prevToasts.filter((toast) => toast.id !== newToast.id)
        );
    }, 5000);
};