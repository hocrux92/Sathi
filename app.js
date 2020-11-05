// Loadind All the Modules
const express=require('express');
const exphbs=require('express-handlebars');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');

// Initialising App or init app
const app = express();
// Setup body parser Middleware

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Load Files
const keys = require('./config/keys');
// Files for User Collection
const User = require('./models/user');

// Connect To MongoDB
mongoose.connect(keys.MongoDB,{
   useNewUrlParser: true,
   useUnifiedTopology: true
},() => {
    console.log("Mongo is Connected...");
});
// .catch((err)=>{
//     console.log(err);
// });

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

// Save Contact DATA
app.post('/contact',(req,res)=>{
   console.log(req.body);
   const newContact = {
       email: req.body.email,
       name: req.body.name,
       message:req.body.message
   }
   new User(newContact).save((err,user)=>{
       if (err) {
           throw err;
       } else {
           console.log('New Contact was created',user);
       }
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