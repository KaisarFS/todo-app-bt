import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TodoList = () => {
  const [checklist, setChecklist] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchChecklist = async () => {
      try {
        const response = await axios.get('http://94.74.86.174:8080/api/checklist', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,  
          }
        });
        setChecklist(response.data.data);  
      } catch (err) {
        setError('Gagal memuat checklist.');
        console.error(err);
      }
    };

    fetchChecklist();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://94.74.86.174:8080/api/checklist/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });

      // Setelah item dihapus, lakukan fetch lagi untuk memperbarui data checklist
      const response = await axios.get('http://94.74.86.174:8080/api/checklist', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,  
        }
      });
      setChecklist(response.data.data);
    } catch (err) {
      setError('Gagal menghapus checklist.');
      console.error(err);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://94.74.86.174:8080/api/checklist', {
        name: newItem,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });

      // Setelah menambahkan item baru, lakukan fetch lagi untuk memperbarui data checklist
      const response = await axios.get('http://94.74.86.174:8080/api/checklist', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,  
        }
      });
      setChecklist(response.data.data);
      setNewItem(''); // Reset input field
    } catch (err) {
      setError('Gagal menambahkan checklist.');
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Todo List</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleAddItem}>
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add new item"
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {checklist.map((item) => (
          <li key={item.id}>
            {item.name}
            <button className='bg-red-500' onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
