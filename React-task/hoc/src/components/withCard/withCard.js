import styled from "styled-components";

const StyledCard = styled.div`
  border: 1px solid #ccc;
  padding: 16px;
  border-radius: 12px;
  width: 300px;
  margin: 20px auto;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
`;

export default function withCard(WrappedComponent) {
  return function CardComponent(props) {
    return (
      <StyledCard>
        <WrappedComponent {...props} />
      </StyledCard>
    );
  };
}
