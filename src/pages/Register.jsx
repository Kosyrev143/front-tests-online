import React, { useState } from 'react';
import axios from 'axios';
import styles from './Register.module.css';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [roles, setRoles] = useState([]);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== passwordRepeat) {
            setError('Пароли не совпадают');
            return;
        }

        try {
            await axios.post('http://localhost:3000/auth/register', {
                email,
                password,
                passwordRepeat,
                roles,
            });
            window.location.href = '/login';
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.message || 'Не удалось зарегистрироваться');
            } else {
                setError('Не удалось зарегистрироваться');
            }
        }
    };

    return (
        <div className={styles.registerContainer}>
            <form className={styles.registerForm} onSubmit={handleSubmit}>
                <h2>Регистрация</h2>
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
                <input
                    type="password"
                    placeholder="Повторите пароль"
                    value={passwordRepeat}
                    onChange={(e) => setPasswordRepeat(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Роли (необязательно, через запятую)"
                    value={roles}
                    onChange={(e) => setRoles(e.target.value.split(',').map(role => role.trim()))}
                />
                <button type="submit">Зарегистрироваться</button>
                {error && <p className={styles.error}>{error}</p>}
            </form>
        </div>
    );
};

export default Register;
