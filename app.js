// Loadind All the Modules
const express=require('express');
const exphbs=require('express-handlebars');
const Handlebars = require('handlebars')
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport= require('passport');
const bcrypt = require('bcryptjs');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const formidable = require('formidable');

// Initialising App or init app
const app = express();

// Setup body parser Middleware
app.use(passport.initialize());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
// Configuration for authentication
app.use(cookieParser());
app.use(session({
    secret:'mysecret',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
// Load Helpers
const {requireLogin,ensureGuest}=require('./helpers/authHelper');

// Making User Global
app.use((req,res,next)=>{
    res.locals.user=req.user||null;
    next();
});
// Load Files
const keys = require('./config/keys');
// Files for User Collection
const User = require('./models/user');
const Contact =require('./models/contact');
const { Passport } = require('passport');
// Load Passports
require('./passport/local');
require('./passport/facebook.js');

//const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
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
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: 'main'
}));

app.set('view engine','handlebars');

 // Connect the client side to server CSS  and Js Files.
app.use(express.static('public'));

// Creating Port
const port= process.env.PORT || 3000;

// handling Home Route
app.get('/',ensureGuest,(req,res)=>{
    res.render('home');

    // res.render('home',{
    //     title: 'Home'
    // });

});

app.get('/about',ensureGuest,(req,res)=>{
    res.render('about',{
        title: 'About'
    });
});

app.get('/contact',requireLogin,(req,res)=>{
    res.render('contact',{
        title:'Contact us'
    });
});

// Save Contact DATAs
app.post('/contact',requireLogin,(req,res)=>{
   console.log(req.body);
   const newContact = {
       //email: req.body.email,
       //name: req.body.name,
       name: req.user._id,
       message:req.body.message
   }
 new Contact(newContact).save((err,user)=>{
       if (err) {
           throw err;
       } else {
           console.log('Ww Have received message from user',user);
       }
   });
});

app.get('/signup',ensureGuest,(req,res)=>{
    res.render('signupForm',{
        title:'Register'
    });
});
app.post('/signup',ensureGuest,(req,res)=>{
    console.log(req.body);
    let errors = [];
    if(req.body.password !==req.body.password2){
        errors.push({text:'Password does Not match'});
    }
    if(req.body.password.length<5){
        errors.push({text:'Password must be at least 5 characters!'});
    }
    if(errors.length>0){
        res.render('signupForm',{
            errors:errors,
            firstname: req.body.firstname,
            lastname:req.body.lastname,
            password:req.body.password,
            password2:req.body.password2,
            email:req.body.email
        })
    }else{
        User.findOne({email:req.body.email})
        .then((user)=>{
            if(user){
                let errors =[]
                errors.push({text:'Email already exists! '});
                res.render('signupForm',{
                    errors:errors,
                    firstname: req.body.firstname,
                    lastname:req.body.lastname,
                    password:req.body.password,
                    password2:req.body.password2,
                    email:req.body.email
                });
            }else{
                let salt=bcrypt.genSaltSync(10);
                let hash = bcrypt.hashSync(req.body.password,salt);
                const newUser = {
                    firstname:req.body.firstname,
                    lastname:req.body.lastname,
                    email:req.body.email,
                    password:hash
                }
                new User(newUser).save((err,user)=>{
                    if(err){
                        throw err;
                    }
                    if(user){
                        let success =[]
                        success.push({text:'Account created Successfully!! You Can Login Now'});
                        res.render('loginForm',{
                            success:success
                        })
                    }
                })
            }
        })
    }
});

app.get('/displayLoginForm',ensureGuest,(req,res)=>{
    res.render('loginForm',{
        title:'Login'
    });
});
// Passport Authentication
app.post('/login',passport.authenticate('local',{
    successRedirect:'/profile',
    failureRedirect:'/loginErrors'
}));
app.get('/auth/facebook',passport.authenticate('facebook',{
    scope: ['email']
}));
app.get('/auth/facebook/callback',passport.authenticate('faceboook',{
    successRedirect: '/profile',
    failureRedirect: '/'
}));
// Display Profile
app.get('/profile',requireLogin,(req,res)=>{
    User.findById({_id:req.user._id})
    .then((user)=>{
        user.online = true;
        user.save((err,user)=>{
            if(err){
                throw err;
            }
            if(user){
                res.render('profile',{
                user:user,
                title:'Profile'
                });
            }
        })
    });
});
app.get('/loginErrors',(req,res)=>{
    let errors = [];
    errors.push({text:'User Not Found or Password Incorrect'});
    res.render('loginForm',{
        errors:errors,
        title:'Error'
    });
});

// List a car Route
app.get('/listCar',requireLogin,(req,res)=>{
    res.render('listCar',{
        title:'Lists'
    });
});
app.post('/listCar',requireLogin,(req,res)=>{
    console.log(req.body);
    res.render('listCar2',{
        title:'Finish'
    });
});
// Receive Image
app.post('/uploadImage',(req,res)=>{
    const form = new formidable.IncomingForm();
    form.on('file',(field,file)=>{
        console.log(file);
    });
    form.on('error',(err)=>{
        console.log(err);
    });
    form.on('end',()=>{
        console.log('Image Successfully Received')
    });
    form.parse(req);
});
// User Logout
app.get('/logout',(req,res)=>{
    User.findById({_id:req.user._id})
    .then((user)=>{
        user.online = false;
        user.save((err,user)=>{
            if(err){
                throw err;
            }
            if(user){
                req.logout();
                res.redirect('/');
            }
        });
    });
});
app.listen(port,()=>{
    console.log('Server is up on port'+ port);
});