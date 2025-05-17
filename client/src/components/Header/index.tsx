import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Nav, NavLink, Logo, AvatarButton, BurgerMenu, MobileMenu, MobileNavLink, CloseButton, Overlay } from './styled';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from '../../authContext';
import logo from '../../assets/FullWhite.png';

const Header: React.FC = () => {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

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
            role = null;
        }
    }

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        const handleClickOutside = (event: MouseEvent) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        logout();
        navigate('/login');
        setIsMobileMenuOpen(false);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            <Nav $scrolled={isScrolled}>
                <Logo to="/" onClick={() => setIsMobileMenuOpen(false)}>
                    <img src={logo} alt="FitUnite Logo" />
                </Logo>

                {/* Десктопное меню */}
                <div className="desktop-nav">
                    {isAuthenticated && role === 'client' && <NavLink to="/workouts">Тренировки</NavLink>}
                    {isAuthenticated && role === 'client' && <NavLink to="/meals">Питание</NavLink>}
                    {isAuthenticated && role === 'client' && <NavLink to="/progress">Прогресс</NavLink>}
                    {isAuthenticated && <NavLink to="/favorites">Избранное</NavLink>}
                    {isAuthenticated && <NavLink to="/programs">Программы</NavLink>}
                    {isAuthenticated && role === 'trainer' && <NavLink to="/my-clients">Мои клиенты</NavLink>}
                    {/* {isAuthenticated && role === 'trainer' && <NavLink to="/workouts">Workouts</NavLink>} */}
                </div>

                <div className="desktop-actions">
                    {isAuthenticated ? (
                        <>
                            <AvatarButton to="/profile">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
                                </svg>
                            </AvatarButton>
                            <Button onClick={handleLogout}>Выйти</Button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login">Вход</NavLink>
                            <NavLink to="/register">Регистрация</NavLink>
                        </>
                    )}
                </div>

                {/* Мобильное меню - кнопка бургера */}
                {isAuthenticated && (
                    <div className="mobile-actions">
                        <BurgerMenu onClick={toggleMobileMenu} $isOpen={isMobileMenuOpen}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </BurgerMenu>
                    </div>
                )}

                {/* Для неавторизованных пользователей в мобильной версии */}
                {!isAuthenticated && (
                    <div className="mobile-actions">
                        <NavLink to="/login" className="mobile-login">Вход</NavLink>
                        <NavLink to="/register" className="mobile-login">Регистрация</NavLink>
                        <NavLink to="/login" className="mobile-adaptive">Войти</NavLink>
                    </div>
                )}
            </Nav>

            {/* Оверлей и мобильное меню */}
            <Overlay $isOpen={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(false)} />
            <MobileMenu $isOpen={isMobileMenuOpen} ref={mobileMenuRef}>
                <CloseButton onClick={toggleMobileMenu}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                    </svg>
                </CloseButton>
                
                <div className="mobile-menu-content">
                    {isAuthenticated && role === 'client' && <MobileNavLink to="/workouts" onClick={toggleMobileMenu}>Тренировки</MobileNavLink>}
                    {isAuthenticated && role === 'client' && <MobileNavLink to="/meals" onClick={toggleMobileMenu}>Питание</MobileNavLink>}
                    {isAuthenticated && role === 'client' && <MobileNavLink to="/progress" onClick={toggleMobileMenu}>Прогресс</MobileNavLink>}
                    {isAuthenticated && <MobileNavLink to="/favorites" onClick={toggleMobileMenu}>Избранное</MobileNavLink>}
                    {isAuthenticated && <MobileNavLink to="/programs" onClick={toggleMobileMenu}>Программы</MobileNavLink>}
                    {isAuthenticated && role === 'trainer' && <MobileNavLink to="/my-clients" onClick={toggleMobileMenu}>Мои клиенты</MobileNavLink>}
                    {/* {isAuthenticated && role === 'trainer' && <MobileNavLink to="/workouts" onClick={toggleMobileMenu}>Workouts</MobileNavLink>} */}
                    {isAuthenticated && <MobileNavLink to="/profile" onClick={toggleMobileMenu}>Профиль</MobileNavLink>}

                    {isAuthenticated && (
                        <Button onClick={handleLogout} className="mobile-logout">Выйти</Button>
                    )}
                </div>
            </MobileMenu>
        </>
    );
};

export default Header;