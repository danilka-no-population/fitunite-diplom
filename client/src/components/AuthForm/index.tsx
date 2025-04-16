/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useState, useEffect } from 'react';
import api from '../../services/api';
import { Button, ErrorMessage, Form, Input, RadioGroup, RadioLabel, FormTitle, InputContainer } from './styled';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../authContext';

const AuthForm: React.FC<{ isLogin?: boolean }> = ({ isLogin = false }) => {
    const [username, setUsername] = useState('');
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [errorField, setErrorField] = useState('');
    const navigate = useNavigate();
    const [role, setRole] = useState<'client' | 'trainer'>('client');
    const { login } = useContext(AuthContext);
    
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError('');
                setErrorField('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setErrorField('');

        const trimmedUsername = username.trim();
        const trimmedEmail = email.trim();
        const trimmedEmailOrUsername = emailOrUsername.trim();
        const trimmedPassword = password.trim();

        // Валидация
        if (!isLogin) {
            if (!trimmedUsername) {
                setError('Пожалуйста, введите имя пользователя');
                setErrorField('username');
                return;
            }
            if (trimmedUsername.length < 3) {
                setError('Некорректно введен юзернейм, слишком короткий (минимум 3 символа)');
                setErrorField('username');
                return;
            }
            if (trimmedUsername.length > 30) {
                setError('Некорректно введен юзернейм, слишком длинный (максимум 30 символов)');
                setErrorField('username');
                return;
            }
            if (username !== trimmedUsername) {
                setError('Некорректно введен юзернейм, удалите пробелы в начале и/или в конце');
                setErrorField('username');
                return;
            }
    
            // Email validations
            if (!trimmedEmail) {
                setError('Пожалуйста, введите email');
                setErrorField('email');
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
                setError('Пожалуйста, введите корректный email');
                setErrorField('email');
                return;
            }
            if (email !== trimmedEmail) {
                setError('Некорректно введен email, удалите пробелы в начале и/или в конце');
                setErrorField('email');
                return;
            }
        } else {
            if (!trimmedEmailOrUsername) {
                setError('Пожалуйста, введите email или имя пользователя');
                setErrorField('emailOrUsername');
                return;
            }
        }

        if (!trimmedPassword) {
            setError('Пожалуйста, введите пароль');
            setErrorField('password');
            return;
        }
        if (trimmedPassword.length < 8) {
            setError('Пароль должен содержать минимум 8 символов');
            setErrorField('password');
            return;
        }

        const endpoint = isLogin ? '/auth/login' : '/auth/register';
        const payload = isLogin
            ? { emailOrUsername: trimmedEmailOrUsername, password: trimmedPassword }
            : { username: trimmedUsername, email: trimmedEmail, password: trimmedPassword, role };
    
        try {
            const response = await api.post(endpoint, payload);
            localStorage.setItem('token', response.data.token);
            login();
            navigate('/');
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || 'Произошла ошибка. Пожалуйста, попробуйте снова.';
            setError(errorMsg);
    
            if (errorMsg.toLowerCase().includes('имя пользователя') || errorMsg.toLowerCase().includes('username')) {
                setErrorField('username');
            } else if (errorMsg.toLowerCase().includes('email')) {
                setErrorField(isLogin ? 'emailOrUsername' : 'email');
            } else if (errorMsg.toLowerCase().includes('пароль') || errorMsg.toLowerCase().includes('password')) {
                setErrorField('password');
            }
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <FormTitle>{isLogin ? 'Вход в аккаунт' : 'Регистрация'}</FormTitle>
            
            {!isLogin ? (
                <>
                    <InputContainer>
                        <Input
                            type="text"
                            placeholder="Имя пользователя"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            $hasError={errorField === 'username'}
                        />
                    </InputContainer>
                    
                    <InputContainer>
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            $hasError={errorField === 'email'}
                        />
                    </InputContainer>
                    
                    <RadioGroup>
                        <RadioLabel $isActive={role === 'client'}>
                            <input
                                type="radio"
                                name="role"
                                value="client"
                                checked={role === 'client'}
                                onChange={() => setRole('client')}
                            />
                            Клиент
                        </RadioLabel>
                        <RadioLabel $isActive={role === 'trainer'}>
                            <input
                                type="radio"
                                name="role"
                                value="trainer"
                                checked={role === 'trainer'}
                                onChange={() => setRole('trainer')}
                            />
                            Тренер
                        </RadioLabel>
                    </RadioGroup>
                </>
            ) : (
                <InputContainer>
                    <Input
                        type="text"
                        placeholder="Email или имя пользователя"
                        value={emailOrUsername}
                        onChange={(e) => setEmailOrUsername(e.target.value)}
                        $hasError={errorField === 'emailOrUsername'}
                    />
                </InputContainer>
            )}
            
            <InputContainer>
                <Input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    $hasError={errorField === 'password'}
                />
            </InputContainer>
            
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <Button type="submit">{isLogin ? 'Войти' : 'Зарегистрироваться'}</Button>
        </Form>
    );
};

export default AuthForm;