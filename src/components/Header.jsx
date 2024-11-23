import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Header.module.css'; // Подключаем стили

const Header = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (token) {
                await axios.post('http://localhost:3000/auth/logout', {}, {
                    headers: {
                        Authorization: `${token}`,
                    },
                });
                localStorage.removeItem('accessToken');
                setIsAuthenticated(false);
                navigate('/login');
            }
        } catch (err) {
            console.error('Ошибка выхода:', err);
        }
    };

    return (
        <header className={styles.header}>
            <nav className={styles.navbar}>
                <ul className={styles.navList}>
                    <li><Link to="/" className={styles.navLink}>Главная</Link></li>
                    {isAuthenticated ? (
                        <>
                            <li><Link to="/my-tests" className={styles.navLink}>Мои тесты</Link></li>
                            <li><Link to="/other-tests" className={styles.navLink}>Другие тесты</Link></li>
                            <li>
                                <button onClick={handleLogout} className={styles.logoutButton}>Выйти</button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/login" className={styles.navLink}>Вход</Link></li>
                            <li><Link to="/register" className={styles.navLink}>Регистрация</Link></li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Header;
