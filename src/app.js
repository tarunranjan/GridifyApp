const express = require('express');
const bodyParser = require('body-parser');
const csvParser = require('csv-parser');
const fs = require('fs');
const Student = require('./models/student');
const cors = require('cors');

// Enable CORS

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const students = [];
app.use(cors());

// Load student data from CSV file
fs.createReadStream('./data/students.csv')
    .pipe(csvParser())
    .on('data', (row) => {
        students.push(new Student(row.id, row.name, row.totalMarks, row.age, row.grade));
    })
    .on('end', () => {
        console.log('Student data loaded successfully.');
    });

// API endpoint for loading student details with pagination
app.get('/students', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const paginatedStudents = students.slice(startIndex, endIndex);
    res.json(paginatedStudents);
});

// API endpoint for filtering student details
app.get('/students/filter', (req, res) => {
    const { age, grade } = req.query;

    let filteredStudents = [...students]; 

    if (age) {
        filteredStudents = filteredStudents.filter(student => student.age === parseInt(age));
    }

    if (grade) {
        filteredStudents = filteredStudents.filter(student => student.grade === grade);
    }

    res.json(filteredStudents);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
