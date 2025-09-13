import BaseModal from "./base-modal";

// Hotel Modal Component
export default function HotelModal({
  isOpen,
  onClose,
  hotelNotes,
  setHotelNotes,
  handleSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;

  hotelNotes: string;
  setHotelNotes: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Mehmonxona">
      <form id="hotel-form" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="hotel-notes"
              className="text-sm font-medium text-[var(--text-color)] mb-1 block"
            >
              Qo&apos;shimcha izoh
            </label>
            <textarea
              id="hotel-notes"
              placeholder="Masalan, mehmonxona turi yoki qo'shimcha xizmatlar"
              rows={3}
              maxLength={500}
              value={hotelNotes}
              onChange={(e) => setHotelNotes(e.target.value)}
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
