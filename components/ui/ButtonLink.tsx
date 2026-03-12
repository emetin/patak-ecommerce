import Link from "next/link";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "dark";
};

export default function ButtonLink({
  href,
  children,
  variant = "primary",
}: ButtonLinkProps) {
  const className =
    variant === "secondary"
      ? "btn-secondary"
      : variant === "dark"
      ? "btn-dark"
      : "btn-primary";

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}