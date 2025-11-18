import React, { useContext } from "react";
import { CardContext } from "./Card";

function CardTitle() {
  const { title } = useContext(CardContext);

  return (
    <h2 style={{ marginBottom: "10px", fontSize: "20px" }}>
      {title}
    </h2>
  );
}

export default CardTitle;
