import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const CreateAnswer = () => {
    const [content, setContent] = useState('');
    const [isCorrect, setIsCorrect] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Получаем questionId из URL
    const query = new URLSearchParams(useLocation().search);
    const questionId = query.get('questionId');

    const handleContentChange = (e) => setContent(e.target.value);
    const handleIsCorrectChange = (e) => setIsCorrect(e.target.checked);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setError('No access token found');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/answer', {
                content,
                isCorrect,
                questionId, // Передаем questionId для привязки ответа
            }, {
                headers: {
                    Authorization: `${token}`,
                },
            });

            console.log('Answer created:', response.data);
            navigate(`/question/${response.data.question.test.id}`);  // Перенаправляем на страницу вопросов для этого вопроса
        } catch (err) {
            if (err.response && err.response.status === 409) {
                // Если сервер вернул ошибку 409 (Conflict)
                setError('У этого вопроса уже есть правильный ответ.');
            } else {
                setError('Failed to create answer');
            }
        }
    };

    return (
        <div>
            <h2>Create New Answer</h2>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Answer Content:</label>
                    <input
                        type="text"
                        value={content}
                        onChange={handleContentChange}
                        required
                    />
                </div>
                <div>
                    <label>
                        Is Correct:
                        <input
                            type="checkbox"
                            checked={isCorrect}
                            onChange={handleIsCorrectChange}
                        />
                    </label>
                </div>
                <br />
                <button type="submit">Submit Answer</button>
            </form>
        </div>
    );
};

export default CreateAnswer;
