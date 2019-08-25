const Joi = require('joi');
const express = require('express'),
                router = express.Router(),
                swaggerUi = require('swagger-ui-express'),
                swaggerDocument = require('./swagger.json');

const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1', router);
//Adding a piece of middleware and using it in the request processing pipeline
app.use(express.json());

const courses = [
    { id: 1, name: 'couse1' },
    { id: 2, name: 'couse2' },
    { id: 3, name: 'couse3' }
];


app.get('/', (req, res) => {

    res.send('Hello World!!!');
});

// app.get('/api/courses', (req, res) => {
//     res.send([1, 2, 3]);
// });

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(x => x.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given Id was not found.');
    res.send(course);//404
});


app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.post('/api/courses', (req, res) => {
   //To validate parameter based on JOI API
    const {error} = ValidateCourse(req.body);
    if (error) return res.status(400).send(result.error.details[0].message);

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };

    //Add this to the array
    courses.push(course);

    //send the response to client with the id so the client would know the id of this response
    res.send(course);
})

app.put('/api/courses/:id', (req, res) => {

    //Look Up Course
    //If not existing return 404
    const course = courses.find(x => x.id === parseInt(req.params.id));
    if (!course) return res.status(400).send('The course with the given ID was not found');


    //Validate
    //If invalid, return 400 - Bad request
    //To validate parameter based on JOI API
    // const result = ValidateCourse(req.body);

    //object distruption
    const {error} = ValidateCourse(req.body);
    if (error) return res.status(400).send(result.error.details[0].message);


    //Update course

    course.name = req.body.name;
    //Return the updated course
    res.send(course);

});

app.delete('/api/courses/:id', (req, res)=>{
    //Look Up Course
    //If not existing return 404
    const course = courses.find(x => x.id === parseInt(req.params.id));
    if (!course) return res.status(400).send('The course with the given ID was not found');


     //object distruption
     const {error} = ValidateCourse(req.body);
     if (error) return res.status(400).send(result.error.details[0].message);

     //Delete
     const index = courses.indexOf(req.params.id);
     courses.splice(index, 1);

     res.send(course)
});


function ValidateCourse(course) {
    const schema = {
        name: Joi.string().min(3).max(30).required()
    };
    return Joi.validate(course, schema);

}

//This gets the essential parameters from the browser http request
// app.get('/api/posts/:year/:month',(req, res)=>{
//     res.send(req.params)
//     });
//This gets a query parameter from the browser
// app.get('/api/posts/:year/:month',(req, res)=>{
//     res.send(req.query)
//     });




const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listing on port ${port}...`)); 