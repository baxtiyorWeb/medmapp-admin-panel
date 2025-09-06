interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'success' | 'danger';
  icon: string;
  iconBg: string;
}

export default function StatCard({ title, value, change, changeType, icon, iconBg }: StatCardProps) {
  return (
    <div className="stat-card-v3">
      <div className={`stat-icon-wrapper ${iconBg}`}>
        <i className={`bi ${icon}`}></i>
      </div>
      <div className="stat-content">
        <p className="stat-title">{title}</p>
        <h4 className="stat-value">{value}</h4>
        <p className={`stat-change text-${changeType} mb-0`}>
          <i className={`bi ${changeType === 'success' ? 'bi-arrow-up' : 'bi-arrow-down'}`}></i>
          <span>{change}</span>
        </p>
      </div>
    </div>
  );
}