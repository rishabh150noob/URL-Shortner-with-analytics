const express = require("express");

const { connectToMongoDB}= require("./connect")
const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter")
const URL = require("./models/url"); 

const path = require("path");
const { urlencoded } = require("body-parser");
const app = express();
const PORT= 8001;

connectToMongoDB("mongodb://localhost:27017/short-url").then( ()=> console.log("mongodb connected"));

app.set("view engine","ejs");
app.set("views",path.resolve("./views"))


app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use("/url",urlRoute);
app.use("/",staticRoute);

app.get("/url/:shortId", async (req,res)=>{
    const shortId=req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        {
            shortID:shortId 
        },
        {
            $push:{
                visitHistory:{
                    timestamp:Date.now(),
                },
            }
        }
    );
    if(!entry){
    return res.status(404).send("Short URL not found");
    }
    res.redirect(entry.redirectURL);

})

app.listen( PORT,()=> console.log(`the serve is at ${PORT}`));

