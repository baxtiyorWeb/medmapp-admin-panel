import BaseModal from "./base-modal";

// Translator Modal Component
export default function TranslatorModal({
  isOpen,
  onClose,
  translatorLanguage,
  setTranslatorLanguage,
  translatorRequirements,
  setTranslatorRequirements,
  handleSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
 
  translatorLanguage: string;
  setTranslatorLanguage: React.Dispatch<React.SetStateAction<string>>;
  translatorRequirements: string;
  setTranslatorRequirements: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Tarjimon Xizmati">
      <form id="translator-form" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="translator-language"
              className="text-sm font-medium text-[var(--text-color)] mb-1 block"
            >
              Til *
            </label>
            <input
              id="translator-language"
              type="text"
              placeholder="Masalan, Ingliz tili"
              maxLength={50}
              minLength={1}
              required
              value={translatorLanguage}
              onChange={(e) => setTranslatorLanguage(e.target.value)}
              className="w-full p-3 bg-[var(--input-bg)] text-[var(--text-color)] border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-slate-500 outline-none transition"
            />
          </div>
          <div>
            <label
              htmlFor="translator-requirements"
              className="text-sm font-medium text-[var(--text-color)] mb-1 block"
            >
              Talablar
            </label>
            <textarea
              id="translator-requirements"
              placeholder="Maxsus talablar (ixtiyoriy)"
              rows={3}
              maxLength={500}
              value={translatorRequirements}
              onChange={(e) => setTranslatorRequirements(e.target.value)}
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
