import React from "react";

function CardBody({ children }) {
  return (
    <p style={{ marginBottom: "15px", color: "#555" }}>
      {children}
    </p>
  );
}

export default CardBody;
