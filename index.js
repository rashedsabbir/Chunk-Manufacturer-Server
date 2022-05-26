const express=require("express")
const cors=require("cors")
const {MongoClient, ServerApiVersion}=require("mongodb")
const ObjectId=require("mongodb").ObjectId
require("dotenv").config();

const app=express()
const port=process.env.PORT || 5000

app.use(express.json())
app.use(cors())

//server running
app.get("/",(req,res)=>{
    res.send("Successfully Run The Node And Express")
})
app.get("/check",(req,res)=>{
    res.send("Check  this for remote url change")
})

//MongoDB connect
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.57lxm.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASS);

async function run() {
    try {
        await client.connect();
        const database = client.db("Chunk-Manufacturer");
        const reviews = database.collection("reviews");
        const cars = database.collection("cars");

        app.get("/cars",async(req,res)=>{
            const count=await cars.find({}).count()
            const page=req.query.page
            const size=parseInt(req.query.size)
            let products;
            if(page){
               products=await cars.find({}).skip(page*size).limit(size).toArray()
      
            }
            else(
             products=await cars.find({}).toArray()
      
            )
            // console.log(products.length)
            res.json({
              count,
              products
            })
          })

        app.get("/reviews",async(req,res)=>{
            const result=await reviews.find({}).toArray()
            res.json(result)
          })
          app.post("/reviews",async(req,res)=>{
            const item=req.body
            const result=await reviews.insertOne(item)
            res.json(result)
          })

          

          
    } finally {
        //   await client.close();
        }
    }
run().catch(console.dir);

//listening to port 5000
app.listen(port,()=>{
    console.log("Running the Localhost",`http://localhost:${port}`)
})
