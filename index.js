import http from "http";
import fs from "fs"
import {getrandomvalues} from "./function.js"

const home =fs.readFile("./file.txt" , () => {
  console.log("file read");
});

const newhome = fs.readFileSync("./file.txt");
const server =  http.createServer((req,res)=>{
   
  if(req.url==="/about")
      {
        res.end(`<h1>Hey! You got ${getrandomvalues()}. Congrats</h1>`)
      }
   else if(req.url==="/")
      {
        res.end("<h1>this is home page</h1>")
      }
    else if(req.url==="/contact")
      {
        res.end(newhome)
      } 
      else{
        res.end("this page is not available")
      }
    });

server.listen(3000,()=>{
    console.log("server is working");
});
