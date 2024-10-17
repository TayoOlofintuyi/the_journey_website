const express = require('express');
const path = require("path");
const bcrypt = require('bcrypt');
const session = require('express-session');
const collection = require("./config");

const app = express();

app.use(express.json());

app.use(express.urlencoded({extended: false}));

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.set('view engine', 'ejs');

app.use(express.static("public"));

app.get('/login', (req,res) => {
    //res.render('login');
    if(req.session.user) {
        res.render('login', {
            user: req.session.username
        });
    }else {
        res.render('login', {
            username: null
        });
    }
});

app.get('/signup', (req,res) => {
    res.render('signup');
});

app.get('/main', (req, res) => {
    /*
    if(req.session.user) {
        res.render('main', {
            user: req.session.username
        });
    }else {
        res.render('main', {
            username: null
        });
    }
        */
    res.render('main', { username: req.session.username });

});

app.get('/about', (req, res) => {
    res.render('about', { username: req.session.username });
});

app.get('/user', (req, res) => {
    res.render('user', { username: req.session.username });
});

app.get('/resources', (req, res) => {
    res.render('resources', { username: req.session.username });
});

app.get('/calender', (req, res) => {
    res.render('calendar', { username: req.session.username });
});

app.get('/journal', (req, res) => {
    res.render('journal', { username: req.session.username });
});

app.post("/signup", async (req, res) => {
    const data = {
        username: req.body.username,
        password: req.body.password
    }

    const existingUser = await collection.findOne({username: data.username});

    if(existingUser){
        res.send("An account already exists with that username. Please choose a different username.");
    }
    else{
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPassword;

        const userData = await collection.insertMany(data);
        console.log(userData);
    }
    res.render('main', {username: req.body.username});

});

app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ username: req.body.username });

        if (!check) {
            return res.send("Username not found");
        }

        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (isPasswordMatch) {
            req.session.username = check.username;
            res.render('main', { username: req.session.username });
        } else {
            res.send("Incorrect password");
        }

    } catch (error) {
        console.error("Error during login:", error); 
        res.send("Something went wrong, please try again.");
    }
});

app.post('/journal', (req, res) => {
    // Handle the form submission
    const title = req.body.title;
    const content = req.body.content;
    const mood = req.body.mood;
    
    // Process the journal entry, save it, etc.
    res.redirect('/journal');
});




const port = 5000;
app.listen(port, () => {
    console.log(`Server running on Port: ${port}`);
})