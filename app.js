// Loadind All the Modules
const express=require('express');
const exphbs=require('express-handlebars');

// Initialising App or init app
const app = express();

// Setup View Engine
app.engine('handlebars',exphbs({
    defaultLayout: 'main'
}));

app.set('view engine','handlebars');

 // Connect the client side to server CSS  and Js Files.
app.use(express.static('public'));

// Creating Port
const port= process.env.PORT || 3000;

// handling Home Route
app.get('/',(req,res)=>{
    res.render('home');

    // res.render('home',{
    //     title: 'Home'
    // });

});

app.get('/about',(req,res)=>{
    res.render('about',{
        title: 'About'
    });
});

app.get('/contact',(req,res)=>{
    res.render('contact',{
        title:'Contact us'
    });
});
app.get('/signup',(req,res)=>{
    res.render('signupForm',{
        title:'Register'
    });
});

app.listen(port,()=>{
    console.log('Server is up on port'+ port);
});