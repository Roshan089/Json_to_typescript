const express = require("express");
const cors = require("cors");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;  // Add fallback port
console.log("Server running on port:", PORT);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize GoogleGenerativeAI with the API key
const genAI = new GoogleGenerativeAI({
  apiKey: process.env.OPEN_AI_API_KEY,  // Make sure the key is set in .env
});

// Define route for converting JSON to TypeScript
app.post("/convert", async (req, res) => {
  try {
    const { value } = req.body;
    
    if (!value) {
      return res.status(400).json({ message: "Missing input value in request body" });
    }

    const prompt = `Convert the JSON object into Typescript interfaces \n ${value} Please, I need only the code, no explanations.`;

    const result = await genAI.generateText({
      model: "gemini-1.5-flash",  // Correct the model method
      prompt: prompt,
    });

    const generatedText = result?.text || "No response";

    res.json({
      message: "Conversion successful",
      response: generatedText,
    });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({
      message: "Error generating content",
      error: error.message,
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
