/**
 * @author J. Djimitry Riviere
 * @name Server.JS
 * @version 0.1.0
 * @description Runs the Server side of the application.
 */

// =========================
// IMPORT LIBRARIES
// =========================
const express = require('express');
const session = require('express-session');
const flash = require('express-flash-2');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const MongoClient = require('mongodb').MongoClient;
const pug = require('pug');


// =========================
// SETUP
// =========================
const app = express();
const port = process.env.PORT || 3000;
let db;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser('keyboard cat'));
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized:true
}));
app.use(flash());
app.use(express.static('public'));

app.set('view engine', 'pug');

// =========================
// DATABASE CONNECTION
// =========================
MongoClient.connect('mongodb://jdtest:abc123@ds129811.mlab.com:29811/quotes_crud', { useNewUrlParser: true }, (err, client) =>{
    if (err) return console.log(err);  
    db = client.db('quotes_crud');
    app.listen(port, () => {
        console.log(`Listening on port ${port}.`);
    });
});


// =========================
// ROUTES
// =========================
app.get('/', (req, res) => {
    db.collection('quotes').find().toArray((err, result) => {
        if (err) console.log(err);
        res.render('index.pug', { quotes: result });
    });
});

app.post('/quotes', (req, res) => {
    const letters = /^[A-Za-z ]+$/;
    const alphaNum = /^[A-Za-z0-9 ]+$/;
    const quoter = req.body.name.trim();
    const phrase = req.body.quote.trim();
    
    if (quoter.match(letters)) {
        if (phrase.match(alphaNum)) {
            db.collection('quotes').save(req.body, (err, result) => {
                if (err) console.log(err);
                console.log('Quote was successfully saved to the database.');   
                res.redirect('/');   
            });
        } else {
            res.flash('info', 'The quote cannot be empty.');
            res.redirect('/');
        }
    } else {
        res.flash('info', 'The name of the quoter can only contain letters.');
        res.redirect('/');
    }
});

app.put('/quotes', (req, res) => {
    db.collection('quotes').findOneAndUpdate(
        { name: 'JD Riviere' },
        { $set: {
                name: req.body.name,
                quote: req.body.quote
            }
        },
        {
            sort: { _id: -1 },
            upsert: true
        },
        (err, result) => {
            if (err) return res.send(err);
            res.send(result);
        }
    );
});

app.delete('/quotes', (req, res) => {
    db.collection('quotes').findOneAndDelete(
        { name: req.body.name },
        (err, result) => {
            if (err) return res.send(500, err);
            res.send({ message: 'A quote from the Forgotten Prince was deleted!' });
        }
    );
});