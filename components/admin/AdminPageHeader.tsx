type AdminPageHeaderProps = {
  eyebrow?: string;
  title: string;
  text?: string;
  actions?: React.ReactNode;
};

export default function AdminPageHeader({
  eyebrow,
  title,
  text,
  actions,
}: AdminPageHeaderProps) {
  return (
    <div className="admin-page-header">
      <div className="admin-page-header__content">
        {eyebrow ? <div className="admin-page-header__eyebrow">{eyebrow}</div> : null}
        <h1 className="admin-page-header__title">{title}</h1>
        {text ? <p className="admin-page-header__text">{text}</p> : null}
      </div>

      {actions ? <div className="admin-page-header__actions">{actions}</div> : null}
    </div>
  );
}