import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import styles from './AllQuestions.module.css'; // Импорт стилей

const AllQuestions = () => {
    const { id } = useParams(); // Получаем id теста из URL
    const [questions, setQuestions] = useState([]); // Состояние для вопросов
    const [error, setError] = useState(''); // Состояние для ошибок

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const token = localStorage.getItem('accessToken'); // Получаем токен из локального хранилища
                if (!token) {
                    setError('Токен доступа не найден'); // Ошибка, если токен не найден
                    return;
                }

                const response = await axios.get(`http://localhost:3000/question/${id}`, {
                    headers: {
                        Authorization: `${token}` // Отправляем токен в заголовках
                    }
                });

                setQuestions(response.data); // Обновляем состояние вопросами
            } catch (err) {
                setError('Не удалось загрузить вопросы'); // Ошибка при получении данных
            }
        };

        fetchQuestions();
    }, [id]); // Перезапуск эффекта при изменении id теста

    return (
        <div className={styles.container}>
            {error && <p className={styles.error}>{error}</p>} {/* Отображаем ошибку, если она есть */}
            <h2 className={styles.title}>
                Вопросы для теста {questions.length > 0 && questions[0].test.title}
            </h2>
            <div className={styles.questionList}>
                {questions.length === 0 ? (
                    <p>Нет доступных вопросов</p> // Сообщение, если нет вопросов
                ) : (
                    questions.map((question) => (
                        <div key={question.id} className={styles.questionCard}>
                            <p className={styles.questionTitle}>
                                <strong>Вопрос:</strong> {question.content}
                            </p>
                            <ul className={styles.answerList}>
                                {question.answers && question.answers.length > 0 ? (
                                    question.answers.map((answer) => (
                                        <li key={answer.id} className={styles.answerItem}>
                                            <strong>Ответ:</strong> {answer.content} <br />
                                            <strong>Правильный:</strong>{' '}
                                            {answer.isCorrect ? 'Да' : 'Нет'}
                                        </li>
                                    ))
                                ) : (
                                    <p>Ответы не найдены</p> // Сообщение, если нет ответов
                                )}
                            </ul>
                            <Link to={`/create-answer?questionId=${question.id}`}>
                                <button className={styles.createButton}>Создать новый ответ</button>
                            </Link>
                        </div>
                    ))
                )}
            </div>
            <Link to={`/create-question?testId=${id}`}>
                <button className={styles.createButton}>Создать новый вопрос</button>
            </Link>
        </div>
    );
};

export default AllQuestions;
