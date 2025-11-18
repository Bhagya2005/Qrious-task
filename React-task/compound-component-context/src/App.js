import React from "react";

import Card from "./Card/Card";
import CardTitle from "./Card/CardTitle";
import CardBody from "./Card/CardBody";
import CardFooter from "./Card/CardFooter";

function App() {
  return (
    <div style={{ padding: "40px" }}>
      <Card title="React Context Card" price={499}>
        <CardTitle />
        <CardBody>
          This card is created using Compound Component + Context.
        </CardBody>
        <CardFooter />
      </Card>
    </div>
  );
}

export default App;
