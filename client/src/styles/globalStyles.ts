import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        font-family: "Plus Jakarta Sans", sans-serif;
        font-optical-sizing: auto;
        font-style: normal;
        background-color: #f5f5f5;
        color: #333;
    }

    a {
        text-decoration: none;
        color: inherit;
    }

    button {
        cursor: pointer;
    }
`;