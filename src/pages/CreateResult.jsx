import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './CreateResult.module.css'; // Импорт стилей как CSS-модуль

const CreateResult = () => {
    const [questions, setQuestions] = useState([]); // Состояние для вопросов
    const [error, setError] = useState(''); // Состояние для ошибок
    const [selectedAnswers, setSelectedAnswers] = useState([]); // Состояние для выбранных ответов
    const navigate = useNavigate(); // Хук для навигации

    // Получаем testId из URL
    const query = new URLSearchParams(useLocation().search);
    const testId = query.get('testId');

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const token = localStorage.getItem('accessToken'); // Получаем токен из localStorage
                if (!token) {
                    setError('Токен доступа не найден');
                    return;
                }

                const response = await axios.get(`http://localhost:3000/question/${testId}`, {
                    headers: {
                        Authorization: `${token}`,
                    },
                });
                setQuestions(response.data); // Загружаем вопросы
            } catch (err) {
                setError('Не удалось загрузить вопросы');
            }
        };

        fetchQuestions();
    }, [testId]);

    // Обработчик выбора ответа (для множественного выбора)
    const handleAnswerSelect = (answerId) => {
        setSelectedAnswers((prev) =>
            prev.includes(answerId)
                ? prev.filter((id) => id !== answerId) // Удалить ответ, если уже выбран
                : [...prev, answerId] // Добавить ответ, если он не выбран
        );
    };

    // Обработчик отправки результатов
    const handleSubmit = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setError('Токен доступа не найден');
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:3000/result/record',
                {
                    testId,
                    answers: selectedAnswers, // Отправляем выбранные ответы
                },
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                }
            );
            console.log('Результат записан:', response.data);

            // Перенаправляем на страницу с результатом
            navigate(`/result/${response.data.id}`);
        } catch (err) {
            setError('Не удалось записать результат');
        }
    };

    return (
        <div className={styles.container}>
            {error && <p className={styles.error}>{error}</p>} {/* Отображаем ошибку, если есть */}
            <h2 className={styles.title}>Вопросы для теста</h2>
            <ul className={styles.questionList}>
                {questions.length === 0 ? (
                    <p>Нет доступных вопросов</p> // Сообщение, если вопросов нет
                ) : (
                    questions.map((question) => (
                        <li key={question.id} className={styles.questionItem}>
                            <p className={styles.questionContent}><strong>Вопрос:</strong> {question.content}</p>
                            <ul className={styles.answerList}>
                                {question.answers &&
                                    question.answers.map((answer) => (
                                        <li key={answer.id} className={styles.answerItem}>
                                            <label>
                                                <input
                                                    type="checkbox" // Чекбокс для множественного выбора
                                                    className={styles.checkbox}
                                                    checked={selectedAnswers.includes(answer.id)} // Проверяем, выбран ли ответ
                                                    onChange={() => handleAnswerSelect(answer.id)} // Обработчик выбора
                                                />
                                                {answer.content}
                                            </label>
                                        </li>
                                    ))}
                            </ul>
                        </li>
                    ))
                )}
            </ul>
            <button className={styles.submitButton} onClick={handleSubmit}>Отправить результаты</button> {/* Кнопка для отправки */}
        </div>
    );
};

export default CreateResult;
