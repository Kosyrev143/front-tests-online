import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Home.module.css';

const Home = () => {
    const [tests, setTests] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                console.log("Токен доступа:", token);

                if (!token) {
                    setError('Токен доступа не найден');
                    return;
                }

                const response = await axios.get('http://localhost:3000/test', {
                    headers: {
                        Authorization: `${token}`
                    }
                });
                console.log(response.data);
                setTests(response.data);
            } catch (err) {
                setError('Не удалось загрузить тесты');
            }
        };

        fetchTests();
    }, []);

    return (
        <div className={styles.homeContainer}>
            <h2 className={styles.title}>Главная страница</h2>
            <p className={styles.welcomeText}>Добро пожаловать на главную страницу.</p>
            <h2 className={styles.subtitle}>Список тестов</h2>
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.testList}>
                {tests.length === 0 ? (
                    <p className={styles.noTests}>Тестов нет</p>
                ) : (
                    tests.map((test) => (
                        <div className={styles.testCard} key={test.id}>
                            <h3 className={styles.testTitle}>{test.title}</h3>
                            <p><strong>Категория:</strong> {test.categoryName}</p>
                            <p><strong>Описание:</strong> {test.description}</p>
                            <p><strong>Автор:</strong> {test.author.email}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Home;
