import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './Result.css'; // Импорт стилей

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
                console.log(response.data)

                setResult(response.data);
            } catch (err) {
                setError('Не удалось загрузить результат');
            }
        };

        fetchResult();
    }, [id]);

    if (error) {
        return <p>{error}</p>;
    }

    if (!result) {
        return <p>Загрузка...</p>;
    }

    return (
        <div className="result-container">
            <h2 className="result-title">Детали результата</h2>
            <p><strong>Пользователь:</strong> {result.user.email}</p>
            <p><strong>Тест:</strong> {result.test.title}</p>
            <p><strong>Баллы:</strong> {result.score}</p>
        </div>
    );
};

export default Result;
