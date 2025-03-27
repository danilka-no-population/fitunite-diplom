import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Nav, NavLink } from './styled';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from '../../authContext';

const Header: React.FC = () => {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    const token = localStorage.getItem('token');
    const isAuthenticated = !!token;

    let decodedToken: { role?: string } | null = null;
    let role: string | null = null;

    if (isAuthenticated && token) {
        try {
          decodedToken = jwtDecode(token) as { role?: string };
          role = decodedToken.role || null;
        } catch (error) {
          console.error('Failed to decode token:', error);
          role = null; // Если токен некорректный, сбрасываем роль
        }
      }

    const handleLogout = () => {
        localStorage.removeItem('token');
        logout()
        navigate('/login');
    };

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
                {isAuthenticated && role === 'trainer' && <NavLink to="/workouts">Workouts</NavLink>}
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