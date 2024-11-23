import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TestList = () => {
    const [tests, setTests] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                console.log("Access Token:", token);

                if (!token) {
                    setError('No access token found');
                    return;
                }


                const response = await axios.get('http://localhost:3000/test', {
                    headers: {
                        Authorization: `${token}`
                    }
                });
                setTests(response.data);
            } catch (err) {
                setError('Failed to fetch tests');
            }
        };

        fetchTests();
    }, []);

    return (
        <div>
            {error && <p>{error}</p>}
            <h2>Tests</h2>
            <ul>
                {tests.length === 0 ? (
                    <p>No tests available</p>
                ) : (
                    tests.map((test) => (
                        <li key={test.id}>
                            <h3>{test.title}</h3>
                            <p><strong>Category:</strong> {test.categoryName}</p>
                            <p><strong>Description:</strong> {test.description}</p>
                            <p><strong>Author ID:</strong> {test.authorId}</p>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default TestList;
