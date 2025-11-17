import styled from "styled-components";

const StyledBody = styled.p`
  margin-bottom: 10px;
  font-size: 16px;
  color: #555;
  line-height: 1.4;
`;

export default function CardBody({ children }) {
  return <StyledBody>{children}</StyledBody>;
}
