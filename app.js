if(process.env.NODE_ENV != "production"){
    require('dotenv').config();

}

console.log(process.env.SECRETE);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate  = require("ejs-mate");
const wrapAsync  = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/reviews.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User  = require("./models/user.js");


const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");

app.listen(8080,()=>{
    console.log("server is listening to the port 8080");
});

// const Mongo_url = "mongodb://127.0.0.1:27017/wanderlust";
const dburl = process.env.ATLASDB_URL;

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const store = MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRETE,
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err);
});

const sessionOption = {
    store,
    secret:process.env.SECRETE,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};


app.get("/",(req,res)=>{
    res.redirect("/listings");
});


app.use(session(sessionOption));
app.use(flash());

//passports
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user|| null;
    // console.log(res.locals.success);
    next();
});




// app.get("/demouser",async(req,res)=>{
//     let fakeUser = new User({
//         email:"student@gmail.com",
//         username:"unknownstudent",
//     });

//    let registeredUser = await User.register(fakeUser,"helloworld");
//    res.send(registeredUser);

// });

main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
});

async function main() {
    await mongoose.connect(dburl);
}

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);




app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong!"} = err;
    res.status(statusCode).render("error.ejs",{message});
   // res.send("something went wrong!");
  // res.status(statusCode).send(message);
});

app.get('/map', (req, res) => {
    res.render('map', { mapToken: process.env.MAP_TOKEN });
});


