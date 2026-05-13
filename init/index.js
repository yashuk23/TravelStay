const initData=require("../init/data")
const mongoose=require("mongoose")
const listingModel=require("../models/listing")

const MONGO_URl = "mongodb://127.0.0.1:27017/wanderlust"
async function main() {
    await mongoose.connect(MONGO_URl)   
}

main().then(() => {
    console.log("Connected to DB")
}).catch((err) => {
    console.log(err.message)
})

let initDB=async ()=>
{
    await listingModel.deleteMany({})
    initData.data=initData.data.map((obj)=>({...obj,owner:"69e26cd2075fc8ed7c848f3d"}))
    await listingModel.insertMany(initData.data)
    console.log("Data Inserted")
}

initDB()
