const express = require('express');
const session = require('express-session')
const passport = require('passport');
require('./auth')

const app = express();

app.use(session({secret:'cats'}));
app.use(passport.initialize());
app.use(passport.session());


function isLOggedIn(req,res,next){
    req.user? next() : res.sendStatus(401)
}


app.get("/",(req,res)=>{
    res.send('<a href="/auth/google">Authenticate With Google<a>');
});

app.get("/auth/google",
    passport.authenticate('google', {scope:['email','profile' ]})
);

app.get("/google/callback",
    passport.authenticate('google',{
        successRedirect:'/protected',
        failureRedirect:'/auth/failure'
    })
)

app.get("/protected",isLOggedIn,(req,res)=>{
    res.send(`Hello ${req.user.displayName}`);
})
app.get("/auth/failure",(req,res)=>{
    res.send("something went wrong");
});

app.get("/logout",(req,res)=>{
    // req.logout();
    req.session.destroy();
    res.send("GoodBye!!")
})

app.listen(3000, ()=> console.log("Hello port at 3000"))