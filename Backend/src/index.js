const express = require("express")
const {dbconnect} =require("./config/database")
const cloudinary = require("./config/cloudinary");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
require("dotenv").config();
const cors = require("cors");
const wasteRoute=require("./routes/wasteRoute");
const orderRoute=require("./routes/orderRoute")
const userRoutes = require("./routes/user");
const pickerRoutes = require("./routes/pickerRoute");
const blogRoutes = require("./routes/blogRoute");
const smsRoutes=require('./routes/smsRoute')

// Middlewares
const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 4000;

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://enviro-mat.vercel.app"
]

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error("Not allowed by CORS"))
      }
    },
    credentials: true,
  })
)


app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: "/tmp/",
	})
);

// Setting up routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/picker", pickerRoutes);
app.use("/api/v1/order",orderRoute);
app.use("/api/v1/waste", wasteRoute);
app.use("/api/v1/blogs", blogRoutes);
app.use("/api/v1/sms", smsRoutes);

// Health check endpoint
app.get("/", (req, res) => {
	return res.json({
		success: true,
		message: "EnviroMat API is running successfully!",
		timestamp: new Date().toISOString()
	});
});



// app.get("/", (req, res) => {
// 	return res.json({
// 		success: true,
// 		message: "Your server is up and running ...",
// 	});
// });


const InitlizeConnection = async()=>{

    try{
        await dbconnect();
        console.log("connected to MongoDB");
        cloudinary.cloudinaryConnect();
         console.log("connected to Cloudinary");
        app.listen(PORT, ()=>{
            console.log(`Listening at port ${PORT} `);
        })
    }
    catch(err){
        console.log("Error "+err);
    }
}

InitlizeConnection();
