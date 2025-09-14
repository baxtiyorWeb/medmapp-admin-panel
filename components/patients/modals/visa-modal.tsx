import BaseModal from "./base-modal";

// Visa Modal Component
export default function VisaModal({
  isOpen,
  onClose,
  visaPassportScan,
  setVisaPassportScan,
  visaNote,
  setVisaNote,
  visaFileInputRef,
  handleSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;

  visaPassportScan: File | null;
  setVisaPassportScan: React.Dispatch<React.SetStateAction<File | null>>;
  visaNote: string;
  setVisaNote: React.Dispatch<React.SetStateAction<string>>;
  visaFileInputRef: React.RefObject<HTMLInputElement | null>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Taklifnoma & Viza">
      <form id="visa-form" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[var(--text-color)] mb-1 block">
              Xorijga chiqish pasportini yuklang <span className="text-red-500">*</span>
            </label>
            <label
              htmlFor="visa-passport-scan"
              className="relative block w-full border-2 border-dashed border-[var(--border-color)] rounded-xl p-4 text-center cursor-pointer hover:border-[#4338CA] transition-colors bg-[var(--card-background)]"
            >
              <i className="bi bi-cloud-arrow-up-fill text-3xl text-[#4338CA]"></i>
              <p className="mt-1 text-sm font-semibold text-[var(--text-color)]">
                fayl yuklash
              </p>
              {visaPassportScan && (
                <p className="text-sm text-slate-500">
                  Yuklangan: {visaPassportScan.name}
                </p>
              )}
            </label>
            <input
              id="visa-passport-scan"
              type="file"
              className="hidden"
              required
              ref={visaFileInputRef}
              onChange={(e) => setVisaPassportScan(e.target.files?.[0] || null)}
            />
          </div>
          <div>
            <label
              htmlFor="visa-note"
              className="text-sm font-medium text-[var(--text-color)] mb-1 block"
            >
              Qo&apos;shimcha izoh
            </label>
            <textarea
              id="visa-note"
              placeholder="Izoh (maksimum 500 belgi)"
              rows={3}
              maxLength={500}
              value={visaNote}
              onChange={(e) => setVisaNote(e.target.value)}
              className="w-full p-3 bg-[var(--input-bg)] text-[var(--text-color)] border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-slate-500 outline-none transition"
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
