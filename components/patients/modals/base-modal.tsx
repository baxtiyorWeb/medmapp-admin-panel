import { Dialog, Transition } from "@headlessui/react";
import { Fragment, ReactNode } from "react";

// Reusable Modal Component (base for all modals)
export default function BaseModal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-[var(--card-background)] rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col border border-[var(--border-color)]">
              <div className="flex items-center justify-between p-5 border-b border-[var(--border-color)]">
                <Dialog.Title className="text-lg font-bold text-[var(--text-color)]">
                  {title}
                </Dialog.Title>
                <button
                  className="text-slate-400 hover:text-slate-600 transition"
                  onClick={onClose}
                >
                  <i className="bi bi-x-lg text-xl cursor-pointer"></i>
                </button>
              </div>
              <div className="p-6 overflow-y-auto">{children}</div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}
