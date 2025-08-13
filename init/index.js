const mongoose = require("mongoose");
const initData = require("./data.js");
const listing = require("../models/listing.js");


const Mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
});

async function main() {
    await mongoose.connect(Mongo_url);
}

const initDB = async () =>{
    await listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({
        ...obj,
         owner: new mongoose.Types.ObjectId("652d0081ae547c5d37e56b5f"),
    }));
    await listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();