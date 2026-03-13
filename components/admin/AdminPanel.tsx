type AdminPanelProps = {
  title?: string;
  text?: string;
  children: React.ReactNode;
};

export default function AdminPanel({
  title,
  text,
  children,
}: AdminPanelProps) {
  return (
    <section className="admin-panel">
      {title || text ? (
        <div className="admin-panel__header">
          {title ? <h2 className="admin-panel__title">{title}</h2> : null}
          {text ? <p className="admin-panel__text">{text}</p> : null}
        </div>
      ) : null}

      <div className="admin-panel__body">{children}</div>
    </section>
  );
}