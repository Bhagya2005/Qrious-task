import React, { useContext } from "react";
import { CardContext } from "./Card";

function CardFooter() {
  const { price } = useContext(CardContext);

  return (
    <div style={{ fontWeight: "bold" }}>
      Price: ₹ {price}
    </div>
  );
}

export default CardFooter;
