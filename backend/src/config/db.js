import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {});
    console.log("✅ Database Connected Successfully");
  } catch (error) {
    console.error("❌ Error connecting to Database", error);
    process.exit(1);
  }
};

export default connectDB;
