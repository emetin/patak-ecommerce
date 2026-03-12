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
      ? "button-link btn-secondary"
      : variant === "dark"
        ? "button-link btn-dark"
        : "button-link btn-primary";

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}