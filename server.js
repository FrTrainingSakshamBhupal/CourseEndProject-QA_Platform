const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

let questions = {
  "quiz": {
    "title": "Sample Quiz",
    "questions": [
      {
        "id": 1,
        "question": "What is the capital of France?",
        "options": ["Paris", "London", "Berlin", "Madrid"],
        "type": "multiple-choice"
      },
      {
        "id": 2,
        "question": "Solve: 5 + 7",
        "options": ["10", "11", "12", "13"],
        "type": "multiple-choice"
      },

      {
        "id": 3,
        "question": "Who is the prime minister of India",
        "options": ["Narendra Modi", "Joe Biden", "Tanaka San", "Vladmir Putin"],
        "type": "multiple-choice"
      }
    ]
  }
};

let answers = {
  "answers": {
    "1": "Paris",
    "2": "12",
    "3": "Narendra Modi"
  }
};

app.get('/questions', (req, res) => {
  res.json(questions);
});

app.post('/questions', (req, res) => {
  const newQuestion = req.body;
  newQuestion.id = questions.quiz.questions.length + 1;
  questions.quiz.questions.push(newQuestion);
  answers.answers[newQuestion.id] = req.body.correctOption;
  res.status(201).json(newQuestion);
});

app.post('/submit', (req, res) => {
  let userAnswers = req.body.answers;
  let result = {
    totalQuestions: Object.keys(answers.answers).length,
    correctAnswers: 0,
    score: ''
  };

  let correctAnswers = {};

  Object.keys(answers.answers).forEach(questionId => {
    correctAnswers[questionId] = answers.answers[questionId];
    if (answers.answers[questionId] === userAnswers[questionId]) {
      result.correctAnswers++;
    }
  });

  result.score = ((result.correctAnswers / result.totalQuestions) * 100).toFixed(2) + '%';

  res.json({ result, correctAnswers });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
