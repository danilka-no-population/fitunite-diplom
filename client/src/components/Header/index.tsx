import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Nav, NavLink } from './styled';
import { jwtDecode } from 'jwt-decode';

const Header: React.FC = () => {
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem('token');
    const token = localStorage.getItem('token')
    let decodedToken
    let role

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if(isAuthenticated){
        decodedToken = jwtDecode(token)
        role = decodedToken.role
    }

    return (
        <Nav>
            <div>
                <NavLink to="/">Home</NavLink>
                {isAuthenticated && role === 'client' && <NavLink to="/workouts">Workouts</NavLink>}
                {isAuthenticated && role === 'client' && <NavLink to="/meals">Meals</NavLink>}
                {isAuthenticated && role === 'client' && <NavLink to="/progress">Progress</NavLink>}
                {isAuthenticated && <NavLink to="/profile">Profile</NavLink>}
                {isAuthenticated && <NavLink to="/favorites">Favorites</NavLink>}
                {isAuthenticated && <NavLink to="/programs">Programs</NavLink>}
                {isAuthenticated && role === 'trainer' && <NavLink to="/my-clients">My Clients</NavLink>}
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