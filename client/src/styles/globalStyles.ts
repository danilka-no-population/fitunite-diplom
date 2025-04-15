import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        font-family: "Exo 2", sans-serif;
        font-optical-sizing: auto;
        font-weight: 400;
        font-style: normal;
        background-color: #f5f5f5;
        color: #333;
        line-height: 1.6;
    }

    a {
        text-decoration: none;
        color: inherit;
    }

    button {
        cursor: pointer;
        font-family: "Exo 2", sans-serif;
    }

    input, textarea, select {
        font-family: "Exo 2", sans-serif;
    }

    /* Анимации */
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes slideUp {
        from { 
            opacity: 0;
            transform: translateY(20px);
        }
        to { 
            opacity: 1;
            transform: translateY(0);
        }
    }




        /* Кастомизация скроллбара */
    ::-webkit-scrollbar {
        width: 12px; /* Ширина скроллбара */
        height: 12px; /* Высота для горизонтального скроллбара */
        border-radius: 10px; /* Радиус углов */
    }

    ::-webkit-scrollbar-track {
        background:rgba(132, 173, 212, 0.53); /* Цвет фона трека */
        border-radius: 3px; /* Радиус углов */
    }

    ::-webkit-scrollbar-thumb {
        background: #05396B; /* Цвет ползунка */
        border-radius: 3px; /* Радиус углов */
    }

    ::-webkit-scrollbar-thumb:hover {
        background:rgb(5, 75, 141); /* Цвет ползунка при наведении */
    }


    
`;