import React from 'react';
import styled from 'styled-components';
import AuthForm from '../components/AuthForm';
import { Link } from 'react-router-dom';

const LoginContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: start;
    min-height: 90vh;
    background-color: #EDF5E0;
    padding: 20px;
`;

const AuthCard = styled.div`
    background: white;
    border-radius: 20px;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 500px;
    padding: 40px;
    text-align: center;
`;

const Title = styled.h1`
    color: #05396B;
    font-size: 2.3rem;
    margin-bottom: 10px;

    @media (max-width: 450px){
        font-size: 1.8rem;
    }
    @media (max-width: 350px){
        font-size: 1.5rem;
    }
    @media (max-width: 320px){
        font-size: 1.3rem;
    }
`;

const Subtitle = styled.p`
    color: #666;
    margin-bottom: 30px;
    font-size: 1.1rem;
`;

const SwitchAuthText = styled.p`
    margin-top: 25px;
    color: #666;
    
    a {
        color: #058E3A;
        font-weight: 600;
        text-decoration: none;
        transition: all 0.3s ease;
        
        &:hover {
            color: #05396B;
            text-decoration: underline;
        }
    }
`;

const Login: React.FC = () => {
    return (
        <LoginContainer>
            <AuthCard>
                <Title>Вход в аккаунт</Title>
                <Subtitle>Войдите в свой аккаунт, чтобы продолжить</Subtitle>
                <AuthForm isLogin />
                <SwitchAuthText>
                    Еще нет аккаунта? <Link to="/register">Зарегистрироваться!</Link>
                </SwitchAuthText>
            </AuthCard>
        </LoginContainer>
    );
};

export default Login;