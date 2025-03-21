import styled from "styled-components";

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 300px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #fff;
`;

export const Input = styled.input`
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

export const Button = styled.button`
    padding: 10px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        background-color: #0056b3;
    }
`;

export const ErrorMessage = styled.p`
    color: red;
    font-size: 14px;
    margin: 0;
`;

export const RadioGroup = styled.div`
    display: flex;
    gap: 10px;
    margin: 10px 0;
`;

export const RadioLabel = styled.label`
    display: flex;
    align-items: center;
    gap: 5px;
`;