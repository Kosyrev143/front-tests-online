import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx'; // Импортируем библиотеку для работы с Excel
import styles from './MyTestList.module.css';

const MyTestList = () => {
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

                const response = await axios.get('http://localhost:3000/test/my-tests', {
                    headers: {
                        Authorization: `${token}`,
                    },
                });
                setTests(response.data);
            } catch (err) {
                setError('Не удалось загрузить мои тесты');
            }
        };

        fetchTests();
    }, []);

    // Функция для экспорта теста в Excel
    const handleExportToExcel = (test) => {
        const ws = XLSX.utils.json_to_sheet([test]); // Преобразуем тест в формат Excel
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Test'); // Добавляем лист в книгу
        XLSX.writeFile(wb, `${test.title}.xlsx`); // Загружаем файл с именем теста
    };

    return (
        <div className={styles.container}>
            {error && <p className={styles.error}>{error}</p>}
            <h2 className={styles.title}>Мои тесты</h2>
            <ul className={styles.testList}>
                {tests.length === 0 ? (
                    <p>Нет доступных тестов</p>
                ) : (
                    tests.map((test) => (
                        <li key={test.id} className={styles.testItem}>
                            <h3 className={styles.testTitle}>
                                <Link to={`/question/${test.id}`} className={styles.testTitle}>
                                    {test.title}
                                </Link>
                            </h3>
                            <p className={styles.details}><strong>Категория:</strong> {test.categoryName}</p>
                            <p className={styles.details}><strong>Описание:</strong> {test.description}</p>
                            <p className={styles.details}><strong>Автор:</strong> {test.author.email}</p>
                            {/* Кнопка для экспорта в Excel */}
                            <button
                                className={styles.exportButton}
                                onClick={() => handleExportToExcel(test)}
                            >
                                Экспорт в Excel
                            </button>
                        </li>
                    ))
                )}
            </ul>
            <Link to="/create-test" className={styles.createButton}>
                Создать новый тест
            </Link>
        </div>
    );
};

export default MyTestList;
