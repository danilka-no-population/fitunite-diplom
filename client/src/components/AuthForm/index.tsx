import React, { useState } from 'react';
import api from '../../services/api';
import { Button, Form, Input } from './styled';

const AuthForm: React.FC<{ isLogin?: boolean }> = ({ isLogin = false }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const endpoint = isLogin ? '/auth/login' : '/auth/register';
        const payload = isLogin ? { email, password } : { username, email, password, role: 'client' };

        try {
        const response = await api.post(endpoint, payload);
        localStorage.setItem('token', response.data.token);
        alert(isLogin ? 'Login successful!' : 'Registration successful!');
        } catch (error) {
        console.error(error);
        alert('An error occurred. Please try again.');
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
        {!isLogin && (
            <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            />
        )}
        <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />
        <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">{isLogin ? 'Login' : 'Register'}</Button>
        </Form>
    );
};

export default AuthForm;