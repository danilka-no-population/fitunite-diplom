import { Link } from "react-router-dom";
import styled from "styled-components";

export const Nav = styled.nav`
    background-color: #007bff;
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const NavLink = styled(Link)`
    color: #fff;
    text-decoration: none;
    margin: 0 10px;
    font-size: 16px;

    &:hover {
        text-decoration: underline;
    }
`;

export const Button = styled.button`
    background-color: transparent;
    border: 1px solid #fff;
    color: #fff;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: #fff;
        color: #007bff;
    }
`;