import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Result = () => {
    const { id } = useParams(); // Получаем ID результата из URL
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    setError('Токен доступа не найден');
                    return;
                }

                const response = await axios.get(`http://localhost:3000/result/${id}`, {
                    headers: {
                        Authorization: `${token}`,
                    },
                });
                setResult(response.data);
            } catch (err) {
                setError('Не удалось загрузить результат');
            }
        };

        fetchResult();
    }, [id]);

    if (error) {
        return <p className={styles.error}>{error}</p>;
    }

    if (!result) {
        return <p className={styles.loading}>Загрузка...</p>;
    }

    return (
        <div className={styles.resultContainer}>
            <h2 className={styles.resultTitle}>Детали результата</h2>
            <p className={styles.resultItem}><strong>Пользователь:</strong> {result.user.email}</p>
            <p className={styles.resultItem}><strong>Тест:</strong> {result.test.title}</p>
            <p className={styles.resultItem}><strong>Баллы:</strong> {result.score}</p>
        </div>
    );
};

export default Result;
