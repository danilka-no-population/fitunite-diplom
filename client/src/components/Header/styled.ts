import { Link } from "react-router-dom";
import styled from "styled-components";

export const Nav = styled.nav`
    background-color:rgb(12, 179, 0);
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const NavLink = styled(Link)`
    color: #ffffff;
    text-decoration: none;
    margin: 10px 10px;
    font-size: 16px;
    padding: 4px;

    &:hover {
        font-weight: bold;
        border: 1px solid white;
        border-radius: 5px;
        background-color: white;
        color: #000000;
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