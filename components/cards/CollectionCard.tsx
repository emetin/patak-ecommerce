import ButtonLink from "../ui/ButtonLink";

type CollectionCardProps = {
  title: string;
  description: string;
  image: string;
  href: string;
};

export default function CollectionCard({
  title,
  description,
  image,
  href,
}: CollectionCardProps) {
  return (
    <article className="card">
      <div
        className="card-media"
        style={{
          backgroundImage: `url(${image})`,
          aspectRatio: "4 / 4.3",
        }}
      />
      <div className="card-body">
        <span className="card-kicker">Collection</span>
        <h3>{title}</h3>
        <p>{description}</p>

        <div style={{ marginTop: 18 }}>
          <ButtonLink href={href}>View Collection</ButtonLink>
        </div>
      </div>
    </article>
  );
}