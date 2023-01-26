// Assign variables to hold specific elements on the HTML using document.getElementByID method to use later
var startButton = document.getElementById("start-btn"); //in .start-container start button
var nextButton = document.getElementById("next-btn"); //in .start-container next button during quiz portion
var questionBoxElement = document.getElementById("question-container"); //in .question-container during quiz portion
var questionElement = document.getElementById("question"); //question area
var answerBtnElement = document.getElementById("answer-btns"); //area for 4 multiple choice answers
var doneBoxElement = document.getElementById("done-container"); //quiz completed area
var formEl = document.getElementById("enter-initials-box"); //text box area for entering initials
var scoreBox = document.getElementById("scoreBox"); //area listing high scores from local storage
var timerEl = document.getElementById("countdown"); //countdown timer w logic for quiz portion

var shuffleQuestions, currentQuestionIndex; //randomly selects questions from list

// countdown timer
var timeInterval;
var timeLeft = 60;
var score = 0;

// declare global variable for array fucntion to grab the initials entered later
var finalInfo = [];

// When start button is clicked, initiate countdown timer, hide start button + endbox, shuffle q's, and display question
function startQuiz() {
  countdown();
  startButton.classList.add("hide"); // hide the start button
  doneBoxElement.classList.add("hide"); // hide the endBox
  shuffleQuestions = questions.sort(() => Math.random() - 0.5);
  currentQuestionIndex = 0;
  questionBoxElement.classList.remove("hide"); // shows the question box and choices
  nextQuestion();
}

//countdown timer for quiz start with setInterval function checks timeLeft variable if more than 1 second it updates HTML. If timeLeft is 0 function stops and uses clearInterval and endGame function
function countdown() {
  var timeInterval = setInterval(function () {
    if (timeLeft >= 1) {
      timerEl.textContent = timeLeft + " seconds remaining";
      timeLeft--;
    } else if (timeLeft === 0) {
      clearInterval(timeInterval);
      endGame();
    }
  }, 1000);
}

// what happens when you click the 'next' btn
function nextQuestion() {
  resetAnswer();
  showQuestion(shuffleQuestions[currentQuestionIndex]);
  // shows the question box and choices
  questionBoxElement.classList.remove("hide");
  // counting what question # you are on
  console.log(currentQuestionIndex);
}

startButton.addEventListener("click", () => {
  restart();
  startQuiz();
});

//currentQuestion function = ++ increment to next question
nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  nextQuestion();
});

function showQuestion(question) {
  questionElement.innerText = question.question;
  // replacing button with the text answer choices
  question.answers.forEach((answer) => {
    var button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("btn");
    if (answer.correct) {
      // storing answer in dataset
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer);
    answerBtnElement.appendChild(button);
  });
}

function resetAnswer() {
  //want to hide the 'next' btn when the next question appears
  nextButton.classList.add("hide");
  while (answerBtnElement.firstChild) {
    answerBtnElement.removeChild(answerBtnElement.firstChild);
  }
}

//when user click button element the variable selectedButton checks the answer and increments the score based on time.  After that, hid the question container, show next button, and check if more questions are left. If no more questions, display next button. Otherwise end the game.
function selectAnswer(event) {
  var selectedButton = event.target;
  var correct = selectedButton.dataset.correct;
  if (correct) {
    score += timeLeft;
    console.log("time" + score);
  } else {
    timeLeft -= 10;
  }
  // hide the question box once the answer is selected
  questionBoxElement.classList.add("hide");
  nextButton.classList.remove("hide");
  if (shuffleQuestions.length > currentQuestionIndex + 1) {
    nextButton.classList.remove("hide");
  } else {
    endGame();
  }
}

function endGame() {
  // log score
  var finalScore = score;
  scoreBox.textContent = "Your score is " + finalScore + ".";
  console.log(finalScore);
  //store score
  localStorage.setItem("finalScore", finalScore);
  timeLeft = "";
  timerEl.textContent = "";

  questionBoxElement.classList.add("hide"); // hide questions
  answerBtnElement.classList.add("hide"); // hide answer btn choices
  nextButton.classList.add("hide"); // hide next btn
  doneBoxElement.classList.remove("hide"); // show endBox

  formEl.addEventListener("submit", (event) => {
    event.preventDefault();
    var userInput = document.querySelector("input[name='Initials']").value;
    console.log(userInput);
    localStorage.setItem("User", userInput);

    //getting highscore
    var userScore = {
      initials: userInput,
      score: finalScore,
    };

    //store the finalInfo from intials into local storage
    var finalInfo = JSON.parse(localStorage.getItem("finalInfo")) || [];
    finalInfo.push(userScore);
    localStorage.setItem("finalInfo", JSON.stringify(finalInfo));
    showScores();
  });
}

function showScores() {
  formEl.remove();
  startButton.innerText = "Restart";
  startButton.classList.remove("hide");

  var finalInfo = JSON.parse(localStorage.getItem("finalInfo")) || [];
  for (i = 0; i < finalInfo.length; i++) {
    //creating new list to display scores
    var submitEl = document.createElement("li");
    submitEl.className = "result";
    submitEl.textContent = finalInfo[i].initials + " : " + finalInfo[i].score;
    scoreBox.appendChild(submitEl);
  }
}

function restart() {
  questionBoxElement.classList.remove("hide");
  answerBtnElement.classList.remove("hide");
  nextButton.classList.remove("hide");
  doneBoxElement.classList.add("hide");
  timeLeft = 60;
}

var questions = [
  {
    question:
      "Which of the following is the correct sequence of HTML tags for starting a webpage?",
    answers: [
      { text: "Head, Title, HTML, Body", correct: false },
      { text: "HTML, Body, Title, Head", correct: false },
      { text: "HTML, Head, Title, Body", correct: false },
      { text: "HTML, Head, Title, Body", correct: true },
    ],
  },
  {
    question:
      "What is the HTML attribute used to define the internal CSS stylesheet?",
    answers: [
      { text: "styles", correct: false },
      { text: "class", correct: false },
      { text: "style", correct: true },
      { text: "variable", correct: false },
    ],
  },
  {
    question: "What are  function and var known as in Javascript?",
    answers: [
      { text: "Keywords", correct: false },
      { text: "Data types", correct: false },
      { text: "Prototypes", correct: false },
      { text: "Declaration statements", correct: true },
    ],
  },
  {
    question:
      "Which of the following DOM is used to find and element by its ID?",
    answers: [
      { text: "getElementById()", correct: true },
      { text: "getElement()", correct: false },
      { text: "createElement()", correct: false },
      { text: "getId()", correct: false },
    ],
  },
  {
    question:
      "Which of the following attributes is used to provide a unique name to an element?",
    answers: [
      { text: "class", correct: false },
      { text: "id", correct: true },
      { text: "type", correct: false },
      { text: "div", correct: false },
    ],
  },
];
