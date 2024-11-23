import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';  // Импорт библиотеки для работы с Excel файлами

const CreateTest = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const [importedData, setImportedData] = useState(null); // Новое состояние для импортированных данных
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setError('Пожалуйста, войдите, чтобы создать тест');
                return;
            }

            try {
                const response = await axios.get('http://localhost:3000/category', {
                    headers: {
                        Authorization: `${token}`,
                    },
                });
                setCategories(response.data);
            } catch (err) {
                setError('Не удалось загрузить категории');
            }
        };

        fetchCategories();
    }, []);

    // Функция для обработки загрузки файла
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            // Предполагаем, что данные находятся в первом листе
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(sheet);

            if (json.length > 0) {
                const importedRow = json[0]; // Берем первый объект (по примеру в картинке)
                setTitle(importedRow.title);
                setDescription(importedRow.description);
                setCategoryId(importedRow.categoryName); // Вы можете изменить это, если категория идентифицирована иначе
            }
        };

        reader.readAsArrayBuffer(file);
    };

    // Функция отправки данных на сервер
    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('accessToken');
        if (!token) {
            setError('Пожалуйста, войдите, чтобы создать тест');
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:3000/test',
                {
                    title,
                    description,
                    categoryId,
                },
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                }
            );

            if (response.status === 201) {
                navigate('/my-tests');
            }
        } catch (err) {
            setError('Не удалось создать тест');
        }
    };

    return (
        <div>
            <h2>Создать новый тест</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Кнопка для загрузки Excel файла */}
            <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                style={{ marginBottom: '20px' }}
            />

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Название теста</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description">Описание теста</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="categoryId">Категория</label>
                    <select
                        id="categoryId"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        required
                    >
                        <option value="">Выберите категорию</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit">Создать тест</button>
            </form>
        </div>
    );
};

export default CreateTest;
