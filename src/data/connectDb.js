import mongoose from "mongoose";


export default async function connectToDB(){
    try{
        await mongoose.connect(process.env.DB_URI ?? "");
        console.log("Connected to database");
        return;
    }catch(error){
        console.log("Error Connecting to Db>>: ")
        process.exit();
    }


}