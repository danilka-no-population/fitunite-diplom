import React, { useContext, useState } from 'react';
import api from '../../services/api';
import { Button, ErrorMessage, Form, Input, RadioGroup, RadioLabel } from './styled';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../authContext';

const AuthForm: React.FC<{ isLogin?: boolean }> = ({ isLogin = false }) => {
    const [username, setUsername] = useState('');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [role, setRole] = useState<'client' | 'trainer'>('client');
    const { login } = useContext(AuthContext);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const endpoint = isLogin ? '/auth/login' : '/auth/register';
        const payload = isLogin
            ? { emailOrUsername, password }
            : { username, email, password, role };

        try {
            const response = await api.post(endpoint, payload);
            localStorage.setItem('token', response.data.token);
            login();
            navigate('/');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            if (error.response) {
            setError(error.response.data.message || 'An error occurred. Please try again.');
            } else {
            setError('An error occurred. Please try again.');
            }
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            {!isLogin ? (
                <>
                    <Input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    {error && error.toLowerCase().includes('username') && <ErrorMessage>{error}</ErrorMessage>}
                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {error && error.toLowerCase().includes('email') && <ErrorMessage>{error}</ErrorMessage>}
                    <RadioGroup>
                        <RadioLabel>
                        <input
                            type="radio"
                            name="role"
                            value="client"
                            checked={role === 'client'}
                            onChange={() => setRole('client')}
                        />
                        Client
                        </RadioLabel>
                        <RadioLabel>
                        <input
                            type="radio"
                            name="role"
                            value="trainer"
                            checked={role === 'trainer'}
                            onChange={() => setRole('trainer')}
                        />
                        Trainer
                        </RadioLabel>
                    </RadioGroup>
                </>
            ) : (
                <Input
                type="text"
                placeholder="Email or Username"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                />
            )}
            <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            {error && error.toLowerCase().includes('password') && <ErrorMessage>{error}</ErrorMessage>}
            <Button type="submit">{isLogin ? 'Login' : 'Register'}</Button>
            {error && !error.toLowerCase().includes('username') && !error.toLowerCase().includes('email') && !error.toLowerCase().includes('password') && (
                <ErrorMessage>{error}</ErrorMessage>
            )}
        </Form>
    );
};

export default AuthForm;