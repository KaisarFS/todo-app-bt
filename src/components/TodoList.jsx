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

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem) {
      setError('Tugas tidak boleh kosong');
      return;
    }

    try {
      const response = await axios.post(
        'http://94.74.86.174:8080/api/checklist',
        { task: newItem }, 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,  
          }
        }
      );

      setChecklist([...checklist, response.data.data]);
      setNewItem(''); 
      setError('');   
    } catch (err) {
      setError('Gagal menambahkan tugas.');
      console.error(err);
    }
  };

  return (
    <div className="todo-container">
      <h1 className="text-xl font-semibold mb-4">Daftar Tugas</h1>

      <ul>
        {checklist.map((item) => (
          <li key={item.id}>
            {item.name} 
          </li>
        ))}
      </ul>

      <form onSubmit={handleAddItem} className="mb-4">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Tulis tugas baru..."
          className="input-field"
        />
        <button type="submit" className="add-button">Tambah</button>
      </form>

      {error && <p className="error-message">{error}</p>}

      <ul>
        {checklist.map((item) => (
          <li key={item.id} className="task-item">
            {item.task} 
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
