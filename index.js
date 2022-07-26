// creating server using http module

/*
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

*/

// express

const { json } = require('express')
var express = require('express')
const joi = require('joi');
var app = express()

app.use(express.json());

const courses = [
    {"id" : 1, "name": "dummy1"},
    {"id" : 2, "name": "dummy2"},
    {"id" : 3, "name": "dummy3"}
];
/////////////////////// get//////////////////////////
app.get('/', (req, res) => {
    // referense : https://expressjs.com/en/4x/api.html
    res.send('hello world')
})

app.get('/names', (req, res) => { 
    res.send(["vishal", "police", "patil"]);
})

app.get('/names/:name', (req, res) => { 
    res.send(typeof(req.params.name));
})

app.get('/date/:year/:month', (req, res) => { 
    res.send(req.params);
    //res.send(req.query); //{"sortBy":"name"}
})

const names = [
    {"firstname" : "vishal", "lastname" : "police Patil"},
    {"firstname" : "alexa", "lastname" : "amazon"},
    {"firstname" : "google", "lastname" : "Alphabet Inc"}
];

app.get('/myname/:firstname', (req, res) => { 
    const Name = names.find(ele => ele.firstname === req.params.firstname);
    if(!Name) 
    {
        res.status(404).send("name not found!")
        return;
    }
    res.send(Name.lastname);
});

app.get("/courses", (req, res) => {
    res.send(courses);
})

/////////////////////// post //////////////////////////


function validatecourse(req, res)
{
    // joi ==> Joi is an object schema description language and validator for JavaScript objects. With Hapi Joi, we create blueprints or schemas for JavaScript objects (an object that stores information) to ensure validation of key information
    const schema = joi.object({
        name : joi.string().min(3).required()
    }); 
    return schema.validate(req.body);
};
app.post("/courses", (req, res) => {
    let result = validatecourse(req, res);
    if (result.error) {
        res.status(400).send(result.error)
        return;
    }
    // console.log(result);
    let course = {
        id : courses.length + 1,
        name : req.body.name
    }; 
    courses.push(course);
    res.send(courses);
});


//////////////////////////put///////////////////////////////////////////////
app.put("/courses/:id", (req, res) => {
    const course = courses.find(ele => ele.id === parseInt(req.params.id) );
    if(!course) 
    {
        res.status(404).send("course not found!")
        return;
    }
    
    let { error } = validatecourse(req, res);
    if (error) return res.status(400).send(error)

    course.name = req.body.name;
    res.send(courses);

});

///////////////////////////////////////////////delete/////////////////////////

app.delete("/courses/:id", (req, res) => {
    const course = courses.find(ele => ele.id === parseInt(req.params.id) );
    if(!course) return res.status(404).send("course not found!");

    let index = courses.indexOf(course);
    courses.splice(index, 1);
    res.send(courses);
});

const port = process.env.PORT || 3000
app.listen(3000 , () => console.log(`server is listening on port ${port}`));