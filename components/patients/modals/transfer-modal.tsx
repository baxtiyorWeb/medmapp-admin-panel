import BaseModal from "./base-modal";

// Transfer Modal Component
export default function TransferModal({
  isOpen,
  onClose,
  transferFlightNumber,
  setTransferFlightNumber,
  transferArrivalDatetime,
  setTransferArrivalDatetime,
  transferTicketScan,
  setTransferTicketScan,
  transferFileInputRef,
  handleSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  
  transferFlightNumber: string;
  setTransferFlightNumber: React.Dispatch<React.SetStateAction<string>>;
  transferArrivalDatetime: string;
  setTransferArrivalDatetime: React.Dispatch<React.SetStateAction<string>>;
  transferTicketScan: File | null;
  setTransferTicketScan: React.Dispatch<React.SetStateAction<File | null>>;
  transferFileInputRef: React.RefObject<HTMLInputElement | null>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Transfer Xizmati">
      <form id="transfer-form" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="transfer-flight-number"
              className="text-sm font-medium text-[var(--text-color)] mb-1 block"
            >
              Reys raqami <span className="">*</span>
            </label>
            <input
              id="transfer-flight-number"
              type="text"
              placeholder="Parvoz raqami (masalan, TK123)"
              maxLength={50}
              minLength={1}
              required
              value={transferFlightNumber}
              onChange={(e) => setTransferFlightNumber(e.target.value)}
              className="w-full p-3 bg-[var(--input-bg)] text-[var(--text-color)] border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-slate-500 outline-none transition"
            />
          </div>
          <div>
            <label
              htmlFor="transfer-arrival-datetime"
              className="text-sm font-medium text-[var(--text-color)] mb-1 block"
            >
              Kelish vaqti <span className="">*</span>
            </label>
            <input
              id="transfer-arrival-datetime"
              type="datetime-local"
              required
              value={transferArrivalDatetime}
              onChange={(e) => setTransferArrivalDatetime(e.target.value)}
              className="w-full p-3 bg-[var(--input-bg)] text-[var(--text-color)] border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-slate-500 outline-none transition"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-[var(--text-color)] mb-1 block">
              Chipta skanini yuklash (ixtiyoriy)
            </label>
            <label
              htmlFor="transfer-ticket-scan"
              className="relative block w-full border-2 border-dashed border-[var(--border-color)] rounded-xl p-4 text-center cursor-pointer hover:border-[#4338CA] transition-colors bg-[var(--card-background)]"
            >
              <i className="bi bi-cloud-arrow-up-fill text-3xl text-[#4338CA]"></i>
              <p className="mt-1 text-sm font-semibold text-[var(--text-color)]">
                Fayl yuklash
              </p>
              {transferTicketScan && (
                <p className="text-sm text-slate-500">
                  Yuklangan: {transferTicketScan.name}
                </p>
              )}
            </label>
            <input
              id="transfer-ticket-scan"
              type="file"
              className="hidden"
              ref={transferFileInputRef}
              onChange={(e) =>
                setTransferTicketScan(e.target.files?.[0] || null)
              }
            />
          </div>
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              className="bg-[#475569] text-white font-bold py-2 px-5 rounded-lg hover:bg-[#64748B] transition cursor-pointer"
              onClick={onClose}
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="bg-[#4154F1] text-white font-bold py-2 px-5 rounded-lg hover:bg-[#4338CA] transition cursor-pointer"
            >
              Buyurtma qilish
            </button>
          </div>
        </div>
      </form>
    </BaseModal>
  );
}
