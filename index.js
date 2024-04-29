import express from 'express';
import axios from 'axios';
import pg from 'pg';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;
app.use(express.static('public'));
const API_URL = ''

app.get('/', async (req, res) => {
    
    return res.render("index.ejs", {pageTitle: "Home | Book Notes"});
});

app.get('/add', async(req, res) => {
    return res.render('add.ejs', {pageTitle: "Add Book | Book Notes"})
})



app.listen(port, (err) => {
    if(err){
        console.log('Error: '+err);
    }else{
        console.log(`Server Running at http://localhost:${port}`);
    }
});