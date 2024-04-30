import express from 'express';
import axios from 'axios';
import pg from 'pg';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

const db = new pg.Client({
    user: 'postgres',
    password: 'pass',
    host: 'localhost',
    database: 'books',
    port: 5432
});

db.connect();

app.get('/', async (req, res) => {
    const result = await db.query("SELECT * FROM book ORDER BY dos");
    const data = result.rows;
    return res.render("index.ejs", {pageTitle: "Home | Book Notes", books: data});
});

app.get('/add', async(req, res) => {
    return res.render('add.ejs', {pageTitle: "Add Book | Book Notes"})
})

app.post('/add', async (req, res) => {
    const data = req.body;
    try{
        const result = await db.query("INSERT INTO book (title, author, dateOfCompletion, feedback, ratings, olid) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;", [data.title, data.author, data.dateOfCompletion, data.feedback, data.rating, data.olid]);
        console.log(result.rows[0]);
    }catch(err){
        console.log("Error:" + err);
    }
    res.redirect('/');
});

app.get('/book', async (req, res) => {
    let id = parseInt(req.query.id);
    try{
        const result = await db.query("SELECT * FROM book WHERE id=$1", [id]);
        const data = result.rows[0];
        return res.render('book.ejs', {book: data, pageTitle: data.title +" | Book Notes"});
    }catch(err){
        console.log("Error: "+ err);
        return res.redirect("/");
    }
})

app.get('/edit', async (req, res) => {
    let id = parseInt(req.query.id);
    try{
        const result = await db.query("SELECT * FROM book WHERE id=$1", [id]);
        const data = result.rows[0];
        return res.render('edit.ejs', {book: data, pageTitle:"Edit | Book Notes"});
    }catch(err){
        console.log("Error: "+ err);
        return res.redirect("/");
    }
});

app.post('/edit', async (req, res) => {
    const data = req.body;
    try{
        const result = await db.query("UPDATE book SET title = $1, author = $2, feedback = $3, ratings =$4, olid = $5 WHERE id = $6;", [data.title, data.author, data.feedback, data.rating, data.olid, data.updateId]);
        console.log('data updates: '+  JSON.stringify(data));
    }catch(err){
        console.log("Error:" + err);
    }
    res.redirect(`/book?id=${data.updateId}`);
});

app.get('/delete', async (req, res) => {
    let id = req.query.id;
    try{
        await db.query("DELETE FROM book WHERE id=$1", [id]);
    }catch(err){
        console.log('Error: '+ err);
    }

    return res.redirect('/');
});

app.listen(port, (err) => {
    if(err){
        console.log('Error: '+err);
    }else{
        console.log(`Server Running at http://localhost:${port}`);
    }
});