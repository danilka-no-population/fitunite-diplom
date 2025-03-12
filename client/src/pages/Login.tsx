import React from 'react';
import AuthForm from '../components/AuthForm';

const Login: React.FC = () => {
    return (
        <>
            <h1>Login</h1>
            <AuthForm isLogin />
        </>
    );
};

export default Login;