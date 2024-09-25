const express = require("express");
const cors = require("cors");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT ;
console.log(PORT);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize GoogleGenerativeAI with the API key
const genAI = new GoogleGenerativeAI(process.env.OPEN_AI_API_KEY);

// Define the model outside the route
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post("/convert", async (req, res) => {
  try {
    const { value } = req.body;

    const prompt = `Convert the JSON object into Typescript interfaces \n ${value} Please, I need only the code, no explanations.`;
    const result = await model.generateContent( prompt );
    const response = await result.response;
    const text = await response.text();

	  console.log(text);
	  
    res.json({
      message: "Successful",
      response: text,
    });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({
      message: "Error generating content",
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});