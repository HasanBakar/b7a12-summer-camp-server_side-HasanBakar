const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json())

/**
 * ___________________________________________
 * Database Activity start 
 * ___________________________________________
 */



const uri = `mongodb+srv://${process.env.Db__User}:${process.env.Db___password}@cluster0.qibhtxb.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
   
    const danceDataBase = client.db("DanceScape");
    const classesCollection = danceDataBase.collection("Classes");
    const usersCollection = danceDataBase.collection("users");
    


// all Class related api
    app.get("/Classes", async(req, res)=>{
            const cursor = await classesCollection.find().toArray();
            res.send(cursor);
    })

// Popular Classes api

app.get("/popularClasses", async(req, res) =>{
  const cursor = await classesCollection.find({ number_student: { $gt: 23 } }).limit(6);
  const result = await cursor.toArray();
  res.send(result);
})

// Popular Instructors api
app.get("/popularInstructors", async(req, res)=>{
  const query = { userType: "Instructor" };
  const cursor = await usersCollection.find(query).limit(6);
  const result = await cursor.toArray();
  res.send(result);
});

// all instructors related api
app.get("/instructors", async(req, res)=>{
  const query = { userType: "Instructor" };
  const cursor = await usersCollection.find(query);
  const result = await cursor.toArray();
  res.send(result);
});


    

// single user insert related api
app.post("/users",async(req, res)=>{
  const user = req.body;
  const query = { email: user.email };
  const existUser = await usersCollection.findOne(query)
  if(existUser){
    return res.send({message: "User already exist!"})
  }
  const result = await usersCollection.insertOne(user);
  console.log(result)
  res.send(result);
})







    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    
    
  }
}
run().catch(console.dir);

/**
 * ___________________________________________
 * Database Activity End 
 * ___________________________________________
 */


app.get("/", (req, res)=>{

    res.send("Hello, Server is ready for providing data!");

});

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})