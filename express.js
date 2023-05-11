import express from "express"
import path from "path"
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import jwt  from "jsonwebtoken";

mongoose.connect("mongodb://127.0.0.1:27017" , {
    dbName: "users_backend",
}).then(() => console.log("Database Connected"))
.catch((e) => console.log(e));

const userschema = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
})

const User = mongoose.model("User",userschema)

const app = express();

// const users = [];

//middlewares
app.use(express.static(path.join(path.resolve() , "public")));
app.use(express.urlencoded({ extended:true}));
app.use(cookieParser());

app.set("view engine","ejs")

const isauthenticated = async(req , res , next) => {
    const {token} = req.cookies;
  
    if(token){
       const decoded = jwt.verify(token , "iwanttotravelwholeworld")

       req.user = await User.findById(decoded._id)


       next();
    }
    else{
      res.render("login")
    }
}

app.get("/" ,isauthenticated  , (req,res)=>{
  res.render("logout" , {name:req.user.name});

})

app.get("/register", (req,res)=>{
     res.render("register")
  })

app.post("/register" , async(req , res) => {
    
    const {name , email , password} = req.body;
    
    let user = await User.findOne({email})
    if(user)
    {
      return res.redirect("/login")
    }


    user = await User.create({
        name,
        email,
        password,
    })
    
    const token = jwt.sign({_id:user._id} , "iwanttotravelwholeworld")

    res.cookie("token" , token , {
        httpOnly:true,
        expires:new Date(Date.now() + 60*1000)
    })
    res.redirect("/")
})

app.post("/login" , async(req , res) => {
    
    const {name , email} = req.body;
    
    let user = await User.findOne({email})
    if(!user)
    {
      return res.redirect("/register")
    }
     
    const ispass = user.password === password;

    // if(!ispass) return res.redirect("/login" , {messsage : "Incorrect Password"})

    user = await User.create({
        name,
        email,
    })
    
    const token = jwt.sign({_id:user._id} , "iwanttotravelwholeworld")

    res.cookie("token" , token , {
        httpOnly:true,
        expires:new Date(Date.now() + 60*1000)
    })
    res.redirect("/")
})
app.get("/logout" , (req,res) => {
    res.cookie("token" ,  null , {
        httpOnly:true,
        expires:new Date(Date.now())
    })
    res.redirect("/")
})

app.listen(5000 ,()=>{
    console.log("your app is created")
});

