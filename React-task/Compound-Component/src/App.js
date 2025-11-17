import Card from "./components/Card";

export default function App() {
  return (
    <div style={{ padding: "30px" }}>
      <Card>
        <Card.Header>Styled Components Card</Card.Header>

        <Card.Body>
          This card is created using the Compound Component Pattern with
          styled-components.
        </Card.Body>

        <Card.Footer>Updated 2025</Card.Footer>
      </Card>
    </div>
  );
}
