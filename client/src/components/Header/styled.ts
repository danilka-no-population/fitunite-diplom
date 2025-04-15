import { Link } from "react-router-dom";
import styled, { css } from "styled-components";

interface NavProps {
    $scrolled: boolean;
}

interface BurgerMenuProps {
    $isOpen: boolean;
}

interface MobileMenuProps {
    $isOpen: boolean;
}

interface OverlayProps {
    $isOpen: boolean;
}

export const NavLink = styled(Link)`
    color: #F5F5F5;
    text-decoration: none;
    margin: 0 0.5rem;
    font-size: 1rem;
    font-weight: 500;
    padding: 0.5rem 0.5rem;
    border-radius: 8px;
    transition: all 0.3s ease;
    position: relative;
    
    &:hover {
        background-color: rgba(255, 255, 255, 0.15);
    }
    
    &.primary {
        background-color: #5CDB94;
        color: #05396B;
        
        &:hover {
            background-color: #8EE4AF;
        }
    }

    &.mobile-login {
        color: #F5F5F5;
        padding: 0.5rem;
    }

    &.mobile-register {
        background-color: #5CDB94;
        color: #05396B;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        font-weight: 500;
    }

    &.mobile-adaptive{
        color: #F5F5F5;
        padding: 0.5rem;
        display: none;
    }
    
    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        width: 0;
        height: 2px;
        background-color: #F5F5F5;
        transition: all 0.3s ease;
        transform: translateX(-50%);
    }
    
    &:hover::after {
        width: 70%;
    }
`;

export const Button = styled.button`
    background-color: transparent;
    border: 2px solid #F5F5F5;
    color: #F5F5F5;
    padding: 0.5rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.3s ease;
    font-size: 1rem;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
    
    &:hover {
        background-color: #F5F5F5;
        color: #058E3A;
    }
    
    &.mobile-logout {
        margin-top: auto;
        margin-bottom: 2rem;
        width: 80%;
        align-self: center;
        background-color: #A80003;
        border-color: #A80003;
        color: #F5F5F5;
        
        &:hover {
            background-color: #D10005;
            border-color: #D10005;
        }
    }
`;

export const Logo = styled(Link)`
    img {
        height: 40px;
        width: auto;

        transition: transform 0.3s ease;

        &:hover {
            transform: scale(1.05);
        }
    }
`;

export const Nav = styled.nav<NavProps>`
    background-color: ${({ $scrolled }) => $scrolled ? 'rgba(5, 142, 58, 0.95)' : '#058E3A'};
    padding: 0.8rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 999;
    box-shadow: ${({ $scrolled }) => $scrolled ? '0 4px 12px rgba(0, 0, 0, 0.1)' : 'none'};
    transition: all 0.3s ease-in-out;
    height: 70px;

    .desktop-actions {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .mobile-actions {
        display: none;
    }

    @media (max-width: 1024px) {
        .desktop-nav {
            gap: 0.1rem;
            margin: 0 0.5rem;
            
            ${NavLink} {
                padding: 0.4rem 0.1rem;
                font-size: 0.95rem;
            }
        }
        
        .desktop-actions {
            gap: 0.3rem;
            
            ${Button} {
                padding: 0.4rem 0.9rem;
                font-size: 0.8rem;
            }
        }

        ${Logo}{
            img {
                height: 35px;
                width: auto;

                transition: transform 0.3s ease;

                &:hover {
                    transform: scale(1.05);
                }
            }
        }
    }

        @media (max-width: 500px) {
        padding: 0.8rem 0.2rem;
        
        .mobile-actions {
            gap: 0.1rem;
            
            ${NavLink} {
                font-size: 0.9rem;
                padding: 0.4rem 0.2rem;
                
                &.mobile-register {
                    padding: 0.4rem 0.2rem;
                }

                &.mobile-login {
                    font-size: 1rem;
                    margin: 0;
                    display: none;
                }

                &.mobile-adaptive{
                    display: block;
                    padding: 0.4rem 0.1rem;
                    font-size: 0.95rem;
                    font-weight: 600;
                }
            }

            ${Logo}{
                img {
                    height: 35px;
                    width: auto;

                    transition: transform 0.3s ease;

                    &:hover {
                        transform: scale(1.05);
                    }
                }
            }
        }
    }

    @media (max-width: 870px) {
        padding: 1rem;
        
        .desktop-nav, .desktop-actions {
            display: none;
        }

        .mobile-actions {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
    }
`;

export const MobileNavLink = styled(Link)`
    color: #05396B;
    text-decoration: none;
    font-size: 1.2rem;
    font-weight: bold;
    padding: 1rem;
    width: 100%;
    text-align: center;
    transition: all 0.3s ease;
    border-radius: 8px;
    margin: 0.5rem 0;
    
    &:hover {
        background-color: rgba(5, 142, 58, 0.1);
    }
`;

export const AvatarButton = styled(Link)`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    
    svg {
        width: 24px;
        height: 24px;
        color: #F5F5F5;
    }
    
    &:hover {
        background-color: rgba(255, 255, 255, 0.3);
        transform: scale(1.05);
    }
`;

export const BurgerMenu = styled.div<BurgerMenuProps>`
    width: 30px;
    height: 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    cursor: pointer;
    z-index: 1001;
    
    span {
        display: block;
        height: 3px;
        width: 100%;
        background-color: #F5F5F5;
        border-radius: 3px;
        transition: all 0.3s ease;
    }
    
    ${({ $isOpen }) => $isOpen && css`
        span:nth-child(1) {
            transform: translateY(10px) rotate(45deg);
        }
        
        span:nth-child(2) {
            opacity: 0;
        }
        
        span:nth-child(3) {
            transform: translateY(-10px) rotate(-45deg);
        }
    `}
`;

export const MobileMenu = styled.div<MobileMenuProps>`
    position: fixed;
    top: 0;
    right: 0;
    width: 80%;
    max-width: 300px;
    height: 100vh;
    background-color: #F5F5F5;
    display: flex;
    flex-direction: column;
    padding: 2rem 1rem 0;
    transform: translateX(${({ $isOpen }) => $isOpen ? '0' : '100%'});
    transition: transform 0.3s ease-in-out;
    z-index: 1001;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);

    .mobile-menu-content {
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow-y: auto;
    }
`;

export const CloseButton = styled.button`
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    background: none;
    border: none;
    cursor: pointer;
    
    svg {
        width: 24px;
        height: 24px;
        color: #05396B;
        transition: transform 0.3s ease;
    }
    
    &:hover svg {
        transform: scale(1.1);
    }
`;

export const Overlay = styled.div<OverlayProps>`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
    opacity: ${({ $isOpen }) => $isOpen ? 1 : 0};
    visibility: ${({ $isOpen }) => $isOpen ? 'visible' : 'hidden'};
    transition: opacity 0.3s ease, visibility 0.3s ease;
`;