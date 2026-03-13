type AdminStatItem = {
  label: string;
  value: string | number;
};

type AdminStatsProps = {
  items: AdminStatItem[];
};

export default function AdminStats({ items }: AdminStatsProps) {
  return (
    <div className="admin-stats">
      {items.map((item, index) => (
        <article className="admin-stat" key={`${item.label}-${index}`}>
          <span className="admin-stat__label">{item.label}</span>
          <strong className="admin-stat__value">{item.value}</strong>
        </article>
      ))}
    </div>
  );
}