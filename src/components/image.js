export const Image = ({ src, style }) => {
  return (
    <img style={{ width: "100px", height: "100px", ...style }} src={src} />
  );
};
