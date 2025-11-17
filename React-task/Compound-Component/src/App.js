import Card from "./components/Card/Card";
import CardHeader from "./components/Card/CardHeader";
import CardBody from "./components/Card/CardBody";
import CardFooter from "./components/Card/CardFooter";

export default function App() {
  return (
    <div style={{ padding: "30px" }}>
      <Card>
        <CardHeader>Compound Component</CardHeader>

        <CardBody>
          This card demonstrates compound components.
        </CardBody>

        <CardFooter>Footer: 2025</CardFooter>
      </Card>
    </div>
  );
}
