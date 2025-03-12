import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Nav } from './styled';
import { NavLink } from 'react-router-dom';

const Header: React.FC = () => {
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <Nav>
            <div>
                <NavLink to="/">Home</NavLink>
                {isAuthenticated && <NavLink to="/workouts">Workouts</NavLink>}
                {isAuthenticated && <NavLink to="/meals">Meals</NavLink>}
                {isAuthenticated && <NavLink to="/progress">Progress</NavLink>}
            </div>
            <div>
                {isAuthenticated ? (
                <Button onClick={handleLogout}>Logout</Button>
                ) : (
                <>
                    <NavLink to="/login">Login</NavLink>
                    <NavLink to="/register">Register</NavLink>
                </>
                )}
            </div>
        </Nav>
    );
};

export default Header;