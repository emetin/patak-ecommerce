type SectionProps = {
  children: React.ReactNode;
  className?: string;
  tone?: "default" | "soft" | "dark";
  tight?: boolean;
};

export default function Section({
  children,
  className = "",
  tone = "default",
  tight = false,
}: SectionProps) {
  const toneClass =
    tone === "soft" ? "section--soft" : tone === "dark" ? "section--dark" : "";

  const tightClass = tight ? "section--tight" : "";

  return <section className={`section ${toneClass} ${tightClass} ${className}`.trim()}>{children}</section>;
}