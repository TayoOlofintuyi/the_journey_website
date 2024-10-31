const express = require('express');
const path = require("path");
const bcrypt = require('bcrypt');
const session = require('express-session');
const collection = require("./config");
const bodyParser = require('body-parser');


const app = express();

app.use(express.json());

app.use(express.urlencoded({extended: false}));

app.use(bodyParser.urlencoded({ extended: true }));


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
        return res.send("An account already exists with that username. Please choose a different username.");
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
            req.session.userId = check._id;
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
    const title = req.body.title;
    const content = req.body.content;
    const mood = req.body.mood;
    
    res.redirect('/journal');
});

app.post('/change-password', async (req, res) => {
    const newPassword = req.body.newPassword;
    const userId = req.session.userId;

    if (!userId) {
        return res.status(400).send('User not logged in');
    }

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        console.log("Hashed Password: ", hashedPassword);

        const result = await collection.updateOne(
            { _id: userId },
            { $set: { password: hashedPassword } }
        );

        console.log("Update Result: ", result);

        if (result.modifiedCount === 1) {
            console.log("Password successfully updated!");
            res.redirect('/user');
        } else {
            console.log("Password update failed!");
            res.status(500).send('Error updating password.');
        }
    } catch (err) {
        console.error('Error during password update:', err);
        res.status(500).send('Something went wrong, please try again.');
    }
});

app.post('/change-username', async (req, res) => {
    const newUsername = req.body.newUsername;
    const userId = req.session.userId;

    if (!userId) {
        return res.status(400).send('User not logged in');
    }

    try {
            const result = await collection.updateOne(
                { _id: userId },
                { $set: { username: newUsername } }
        );

        // Log to check the result of the update query
        console.log("Update Result: ", result);

        if (result.modifiedCount === 1) {
            req.session.username = newUsername;
            console.log("Username successfully updated!");
            res.redirect('/user');  // Success
        } else {
            console.log("Username update failed!");
            res.status(500).send('Error updating username.');
        }
    } catch (err) {
        console.error('Error during username update:', err);
        res.status(500).send('Something went wrong with username, please try again.');
    }
});
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if(err){
            console.log("Error logging out");
        }
    });
    res.redirect('/login');
});


const port = 5001;
app.listen(port, () => {
    console.log(`Server running on Port: ${port}`);
})