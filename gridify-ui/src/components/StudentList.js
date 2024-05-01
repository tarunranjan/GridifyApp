// src/components/StudentList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState({});

  useEffect(() => {
    axios.get('/students')
      .then(response => {
        setStudents(response.data);
      })
      .catch(error => {
        console.error('Error fetching students:', error);
      });
  }, []);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilter({ ...filter, [name]: value });
  };

  const applyFilter = () => {
    axios.get('/students/filter', { params: filter })
      .then(response => {
        setStudents(response.data);
      })
      .catch(error => {
        console.error('Error applying filter:', error);
      });
  };

  return (
    <div>
      <h2>Student List</h2>
      <div>
        <label>Age:</label>
        <input type="text" name="age" onChange={handleFilterChange} />
        <label>Grade:</label>
        <input type="text" name="grade" onChange={handleFilterChange} />
        <button onClick={applyFilter}>Apply Filter</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Total Marks</th>
            <th>Age</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.name}</td>
              <td>{student.totalMarks}</td>
              <td>{student.age}</td>
              <td>{student.grade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList;
