const Joi = require('joi');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const courses = [
    {id: 1, name: 'course 1'},
    {id: 2, name: 'course 2'},
    {id: 3, name: 'course 3'}
]

app.use(express.json());

app.listen(PORT, () =>{
    console.log(`Listening on port ${PORT}...`)
});

app.get('/', (req, res) => {
    res.send('Courses')
});

app.get('/api/courses', (req, res) => {
    res.send(courses)
});

app.get('/api/courses/:id', (req, res) => {
    
    const course = courses.find(course => course.id === parseInt(req.params.id));
    
    if (!course) return res.status(404).send(`The course with ID ${req.params.id} was not found`);

    res.send(course)
});

app.post('/api/courses', (req, res) => {
   
    const {error} = validateCourse(req.body);
    
    if (error) return res.status(400).send(error.details[0].message);

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {

    const course = courses.find(course => course.id === parseInt(req.params.id));
    
    if (!course) return res.status(404).send(`The course with ID ${req.params.id} was not found`); 

    const {error} = validateCourse(req.body);
    
    if (error) return res.status(400).send(error.details[0].message);
       
    course.name = req.body.name;
    res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
    
    const course = courses.find(course => course.id === parseInt(req.params.id));
    
    if (!course) return res.status(404).send(`The course with ID ${req.params.id} was not found`)
    
    const index = courses.indexOf(course);

    courses.splice(index, 1);

    res.send(course);
})

const validateCourse = (course) => {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema);
}