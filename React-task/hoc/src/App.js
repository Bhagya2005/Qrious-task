import {
  UserCardWithWrapper,
  ProductCardWithWrapper,
} from "./components/withCard";

export default function App() {
  return (
    <div style={{ padding: "30px" }}>
      <UserCardWithWrapper name="Bhagya" age={21} />

      <ProductCardWithWrapper title="MacBook Air" price={99999} />
    </div>
  );
}
