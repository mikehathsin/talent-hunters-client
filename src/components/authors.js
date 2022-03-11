import { Paragraph } from "./paragraph";
import { Title } from "./title";
import { Image } from "./image";

export const Authors = () => {
  const authors = [
    { name: "Miguel Padrino", image: "https://github.com/mikehathsin.png" },
    { name: "Samaria Valdez", image: "https://github.com/Samariavs.png" },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Title>Autores</Title>
      <div style={{ display: "flex", gap: "16px" }}>
        {authors.map(({ name, image }) => (
          <div key={name}>
            <Paragraph>{name}</Paragraph>
            <Image src={image} />
          </div>
        ))}
      </div>
    </div>
  );
};
