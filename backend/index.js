
var mylib = require('./controllers/myFunctions');
const express = require('express')
var bodyParser = require('body-parser');
const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.use(function (req, res, next) {
    console.log(req.body) // populated!
    next();
  })

app.get('/', (req, res) =>{
    res.sendFile('./views/index.html');
})
app.get('/styles.css', (req, res) =>{
    res.sendFile('./views/style.css');
})



app.post('/auth', (req, res) =>{
    // mylib.compile();
    var data = {id: mylib.getUniqId()}
    res.send(data);
})

var data = [{title:'C++', image: 'http://thekites.in/wp-content/uploads/2017/10/33797.jpeg', key:'c++'},
{title:'Python',image: 'http://appworksinc.com/wp-content/uploads/2014/07/Python.png', key:'python'},
{title:'Nodejs',image: 'https://cdn.colorlib.com/wp/wp-content/uploads/sites/2/nodejs-frameworks.png', key:'nodejs'},
];

app.post('/languages', (req, res) =>{

    res.send(data);

})

app.post('/search', function (req, res) {
    var sdata = [];
    for(var i = 0 ; i< data.length ; i++){
        if(String(data[i].key).includes(req.body.key)){
            sdata.push(data[i]);
        }
    }
    res.send(sdata);
})



app.post('/run', function (req, res) {
    var fs = require('fs');
    fs.writeFile("test.c", req.body.code, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
    }); 
    mylib.compile(res)
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))