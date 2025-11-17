import styled from "styled-components";

const StyledFooter = styled.div`
  border-top: 1px solid #eee;
  padding-top: 10px;
  margin-top: 10px;
  color: #777;
  font-size: 14px;
  text-align: right;
`;

export default function CardFooter({ children }) {
  return <StyledFooter>{children}</StyledFooter>;
}
