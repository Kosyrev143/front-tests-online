import React, { useState } from 'react';
import axios from 'axios';
import styles from './Login.module.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3000/auth/login', {
                email,
                password
            });
            localStorage.setItem('accessToken', response.data.accessToken);
            window.location.href = '/';
        } catch (err) {
            setError('Не удалось войти. Проверьте данные.');
        }
    };

    return (
        <div className={styles.loginContainer}>
            <form className={styles.loginForm} onSubmit={handleSubmit}>
                <h2>Вход</h2>
                <input
                    type="email"
                    placeholder="Электронная почта"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Войти</button>
                {error && <p className={styles.error}>{error}</p>}
            </form>
        </div>
    );
};

export default Login;
