const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
require('dotenv').config();

var $ = require("jquery");

const app = express();
const server = createServer(app);

const port = 3000
//const __dirname = dirname(fileURLToPath(import.meta.url));

// Google Gemini Code
const {
	  GoogleGenerativeAI,
	  HarmCategory,
	  HarmBlockThreshold,
	} = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

app.use(express.urlencoded());
app.use(express.json());

const model = genAI.getGenerativeModel({
	model: "gemini-1.5-pro",
});

const generationConfig = {
	temperature: 1,
	topP: 0.95,
	topK: 64,
	maxOutputTokens: 500,
	responseMimeType: "text/plain",
};

async function run(question, response) {
	const chatSession = model.startChat({
	generationConfig,
	// safetySettings: Adjust safety settings
	// See https://ai.google.dev/gemini-api/docs/safety-settings
	history: [
		{
        role: "user",
        parts: [
          {text: "You're a genius. You can answer any questions around the world"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "It's kind of you to say! While I can access and process a vast amount of information, it's important to remember that I'm not actually a genius. I'm a large language model, trained to be informative and comprehensive.  \n\nThink of me as a powerful tool for exploring the world's knowledge.  I can:\n\n* **Answer your questions:** I can provide summaries of factual topics, explain concepts, and even generate creative text formats.\n* **Help you learn:** Ask me anything! I'm here to help you understand new information. \n* **Spark your creativity:**  I can help you brainstorm ideas, write stories, and even compose poems. \n\n**What questions can I answer for you today?**  😊 \n"},
        ],
      },
	],
	});
	const result = await chatSession.sendMessage(question);
	console.log(result.response.text());
	response.send(result.response.text());
}

app.post("/sendMessage", (req, res) => {
	console.log(req.body.msg);
	run(req.body.msg, res);
});

app.get('/', (req, res) => {
	res.sendFile(join(__dirname, 'index.html'));
});

server.listen(port, ()=> {
	console.log(`Server is running at http://localhost:${port}`)
});
