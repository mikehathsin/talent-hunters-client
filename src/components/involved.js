import { Authors } from "./authors";
import { Instructor } from "./instructor";

export const Involved = () => {
  return (
    <div style={{ display: "flex", gap: "32px" }}>
      <Authors />
      <div style={{ width: "1px", background: "gray" }} />
      <Instructor />
    </div>
  );
};
