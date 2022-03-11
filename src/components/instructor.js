import { Paragraph } from "./paragraph";
import { Title } from "./title";
import { Image } from "./image";

export const Instructor = () => {
  const instructor = {
    name: "Virginia Padilla",
    image:
      "https://moodle.uneg.edu.ve/pluginfile.php/250/user/icon/boost/f1?rev=65856",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Title>Institutriz</Title>
      <div style={{ display: "flex" }}>
        <div>
          <Paragraph>{instructor.name}</Paragraph>
          <Image src={instructor.image} />
        </div>
      </div>
    </div>
  );
};
