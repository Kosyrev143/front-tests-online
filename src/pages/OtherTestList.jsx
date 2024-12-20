import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './OtherTestList.module.css';

const OtherTestList = () => {
    const [tests, setTests] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const token = localStorage.getItem('accessToken');

                if (!token) {
                    setError('Токен доступа не найден');
                    return;
                }

                const response = await axios.get('http://localhost:3000/test/other-tests', {
                    headers: {
                        Authorization: `${token}`,
                    },
                });
                setTests(response.data);
            } catch (err) {
                setError('Не удалось загрузить тесты других пользователей');
            }
        };

        fetchTests();
    }, []);

    return (
        <div className={styles.container}>
            {error && <p className={styles.error}>{error}</p>}
            <h2 className={styles.title}>Тесты других пользователей</h2>
            <ul className={styles.testList}>
                {tests.length === 0 ? (
                    <p>Нет доступных тестов</p>
                ) : (
                    tests.map((test) => (
                        <li key={test.id} className={styles.testItem}>
                            <h3 className={styles.testTitle}>{test.title}</h3>
                            <p className={styles.details}><strong>Категория:</strong> {test.categoryName}</p>
                            <p className={styles.details}><strong>Описание:</strong> {test.description}</p>
                            <p className={styles.details}><strong>Автор:</strong> {test.author.email}</p>
                            <Link to={`/create-result?testId=${test.id}`} className={styles.linkButton}>
                                Пройти тест
                            </Link>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default OtherTestList;
