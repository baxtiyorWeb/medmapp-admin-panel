// Reusable ServiceCardItem Component
export default function ServiceCardItem({
  icon,
  title,
  description,
  onClick,
}: {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <div className="service-card bg-[var(--card-background)] rounded-2xl p-5 text-center flex flex-col items-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-[var(--border-color)]">
      <div className="w-16 h-16 rounded-full bg-[var(--color-primary-50)] dark:bg-[var(--color-primary-900)]/50 flex items-center justify-center mb-4">
        <i className={`bi ${icon} text-3xl text-[var(--color-primary)]`}></i>
      </div>
      <h4 className="font-bold text-[var(--text-color)] mb-1">{title}</h4>
      <p className="text-xs text-[var(--text-light)] flex-grow mb-4">
        {description}
      </p>
      <button
        className="service-btn w-full bg-[var(--color-primary-50)] dark:bg-[var(--color-primary-800)]/50 text-[var(--color-primary-600)] dark:text-[var(--color-primary-200)] font-semibold py-2 px-4 rounded-lg text-sm hover:bg-[var(--color-primary-100)] dark:hover:bg-[var(--color-primary-700)] transition cursor-pointer"
        onClick={onClick}
      >
        Buyurtma qilish
      </button>
    </div>
  );
}
