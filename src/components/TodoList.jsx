import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TodoList = () => {
  const [checklist, setChecklist] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [error, setError] = useState('');

  const fetchChecklist = async () => {
    try {
      const response = await axios.get(
        'http://94.74.86.174:8080/api/checklist',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setChecklist(response.data.data);
    } catch (err) {
      setError('Gagal memuat checklist.');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchChecklist();
  }, []);

  const handleAddItem = async () => {
    if (newItem.trim() === '') return;

    try {
      await axios.post(
        'http://94.74.86.174:8080/api/checklist',
        { name: newItem },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setNewItem('');
      fetchChecklist(); // re-fetch checklist after adding item
    } catch (err) {
      setError('Gagal menambahkan checklist.');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://94.74.86.174:8080/api/checklist/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchChecklist(); 
    } catch (err) {
      setError('Gagal menghapus checklist.');
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold mb-4 text-center">To-Do List</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="mb-4">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg"
          placeholder="Tambah tugas baru..."
        />
        <button
          onClick={handleAddItem}
          className="w-full mt-3 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          Tambahkan
        </button>
      </div>

      <ul className="space-y-2">
        {checklist.map((item) => (
          <li
            key={item.id}
            className="flex justify-between items-center p-3 border-b border-gray-200"
          >
            <span className="text-lg">{item.name}</span>
            <button
              onClick={() => handleDelete(item.id)}
              className="text-red-500 hover:text-red-700"
            >
              Hapus
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
