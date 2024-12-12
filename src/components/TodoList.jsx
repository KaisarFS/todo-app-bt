import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TodoList = () => {
  const [checklist, setChecklist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchChecklist = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://94.74.86.174:8080/api/checklist', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setChecklist(response.data.data); 
        setLoading(false);
      } catch (err) {
        setError('Gagal mengambil data checklist');
        setLoading(false);
      }
    };

    fetchChecklist();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Daftar Checklist</h1>
      <ul>
        {checklist.map((item) => (
          <li key={item.id}>
            {item.name} 
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
