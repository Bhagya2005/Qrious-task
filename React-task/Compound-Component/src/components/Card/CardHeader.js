import styled from "styled-components";

const StyledHeader = styled.h2`
  margin-bottom: 10px;
  font-size: 22px;
  color: #333;
`;

export default function CardHeader({ children }) {
  return <StyledHeader>{children}</StyledHeader>;
}
