import styled, { css } from 'styled-components';

interface InputProps {
    $hasError?: boolean;
}

interface RadioLabelProps {
    $isActive?: boolean;
}

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
`;

export const FormTitle = styled.h2`
    color: #05396B;
    font-size: 1.8rem;
    margin-bottom: 10px;
    text-align: center;
    @media (max-width: 450px){
        font-size: 1.5rem;
    }
    @media (max-width: 350px){
        font-size: 1.2rem;
    }
`;

export const InputContainer = styled.div`
    position: relative;
    width: 100%;
`;

export const Input = styled.input<InputProps>`
    padding: 15px 20px;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    font-size: 1rem;
    width: 100%;
    transition: all 0.3s ease;
    background-color: #f9f9f9;
    
    &:focus {
        border-color: #5CDB94;
        background-color: white;
        outline: none;
        box-shadow: 0 0 0 3px rgba(92, 219, 148, 0.2);
    }
    
    ${({ $hasError }) => $hasError && css`
        border-color: #A80003;
        background-color: rgba(168, 0, 3, 0.05);
        
        &:focus {
            box-shadow: 0 0 0 3px rgba(168, 0, 3, 0.2);
        }
    `}
    
    &::placeholder {
        color: #999;
    }
`;

export const Button = styled.button`
    padding: 15px 20px;
    background-color: #058E3A;
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 10px;
    
    &:hover {
        background-color: #046b2d;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(5, 142, 58, 0.3);
    }
    
    &:active {
        transform: translateY(0);
    }
`;

export const ErrorMessage = styled.div`
    color: #A80003;
    background-color: rgba(168, 0, 3, 0.1);
    padding: 12px 15px;
    border-radius: 8px;
    font-size: 0.9rem;
    text-align: center;
    animation: fadeIn 0.3s ease;
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;

export const RadioGroup = styled.div`
    display: flex;
    gap: 15px;
    margin: 5px 0 15px;
`;

export const RadioLabel = styled.label<RadioLabelProps>`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 15px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    flex: 1;
    justify-content: center;
    background-color: ${({ $isActive }) => $isActive ? '#058E3A' : '#f0f0f0'};
    color: ${({ $isActive }) => $isActive ? 'white' : '#333'};
    font-weight: ${({ $isActive }) => $isActive ? '600' : 'normal'};
    
    input {
        display: none;
    }
    
    &:hover {
        background-color: ${({ $isActive }) => $isActive ? '#046b2d' : '#e0e0e0'};
    }
`;