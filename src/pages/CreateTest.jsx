import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateTest = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Получаем список категорий с сервера
    useEffect(() => {
        const fetchCategories = async () => {

            const token = localStorage.getItem('accessToken');
            if (!token) {
                setError('Please login to create a test');
                return;
            }

            try {
                const response = await axios.get('http://localhost:3000/category', {
                    headers: {
                        Authorization: `${token}`
                    }
                });
                setCategories(response.data);
            } catch (err) {
                setError('Failed to load categories');
            }
        };

        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('accessToken');
        if (!token) {
            setError('Please login to create a test');
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:3000/test',
                {
                    title,
                    description,
                    categoryId
                },
                {
                    headers: {
                        Authorization: `${token}`
                    }
                }
            );

            if (response.status === 201) {
                navigate('/my-tests');
            }
        } catch (err) {
            setError('Failed to create test');
        }
    };

    return (
        <div>
            <h2>Create New Test</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Test Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description">Test Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="categoryId">Category</label>
                    <select
                        id="categoryId"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        required
                    >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit">Create Test</button>
            </form>
        </div>
    );
};

export default CreateTest;
