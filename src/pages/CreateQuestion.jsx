import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateQuestion = () => {
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Получаем testId из URL, чтобы создать вопрос для конкретного теста
    const testId = new URLSearchParams(window.location.search).get('testId');

    const handleContentChange = (e) => setContent(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setError('No access token found');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/question', {
                content,
                testId: testId,  // Используем testId из URL
            }, {
                headers: {
                    Authorization: `${token}`,
                },
            });

            console.log('Question created:', response.data);
            navigate(`/question/${testId}`);  // Перенаправляем на страницу вопросов с данным testId
        } catch (err) {
            setError('Failed to create question');
        }
    };

    return (
        <div>
            <h2>Create New Question</h2>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Question Content:</label>
                    <input
                        type="text"
                        value={content}
                        onChange={handleContentChange}
                        required
                    />
                </div>
                <br />
                <button type="submit">Submit Question</button>
            </form>
        </div>
    );
};

export default CreateQuestion;
