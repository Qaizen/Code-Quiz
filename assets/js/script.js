// Assign variables to specific elements on HTML using document.getElementByID to use later
var startButton = document.getElementById("start-btn"); //in .start-container start button
var nextButton = document.getElementById("next-btn"); //in .start-container next button during quiz portion
var questionBoxElement = document.getElementById("question-container"); //in .question-container during quiz protion
var containerElement = document.getElementById("quiz-container"); 
var questionElement = document.getElementById("question");
var answerBtnElement = document.getElementById("answer-btns");
var highscoreBtnElement = document.getElementById("highscore-btn");
var endBoxElement = document.getElementById("done-container");
var submitBtn = document.getElementById("enter-initials");
var formEl = document.getElementById("enter-initials-box");
var scoreBox = document.getElementById("scoreBox");
var timerEl = document.getElementById('countdown');
var shuffledQuestions, currentQuestionIndex;

var timeInterval;
var timeLeft = 60;
let score = 0;

let finalInfo = [];

function startQuiz() {
    countdown();
    startButton.classList.add('hide');      // hide the start button
    endBoxElement.classList.add('hide');  // hide the endBox
    shuffledQuestions = questions.sort(() => Math.random() - .5);
    currentQuestionIndex = 0;  
    questionBoxElement.classList.remove('hide');    // shows the question box and choices
    nextQuestion();
}

function countdown() {
    var timeInterval = setInterval(function() {
    if (timeLeft >=1){
        timerEl.textContent = timeLeft + " seconds remaining";
        timeLeft--;
    }
    else if (timeLeft === 0) {
        clearInterval(timeInterval);
        endGame();
    }
    }, 1000);
}

// what happens when you click the 'next' btn 
function nextQuestion() {               
    resetAnswer();                        
    showQuestion(shuffledQuestions[currentQuestionIndex]);
    // shows the question box and choices
    questionBoxElement.classList.remove('hide');   
    // counting what question # you are on
    console.log(currentQuestionIndex);
}        

startButton.addEventListener('click', () => {
    restart();
    startQuiz();
})

//currentQuestion function = ++ increment to next q
nextButton.addEventListener('click', () => {    
    currentQuestionIndex++;
    nextQuestion();
})

function showQuestion(question) {
    questionElement.innerText = question.question;
    // replacing button with the text answer choices
    question.answers.forEach(answer => {            
        var button = document.createElement("button");
        button.innerText = answer.text;
        button.classList.add('btn');
        if (answer.correct) {
            // storing answer in dataset
            button.dataset.correct = answer.correct;        
        }
        button.addEventListener('click', selectAnswer);
        answerBtnElement.appendChild(button);
    })
}

function resetAnswer() {
    //want to hide the 'next' btn when the next answer appears
    nextButton.classList.add("hide");       
    while (answerBtnElement.firstChild) {
        answerBtnElement.removeChild(answerBtnElement.firstChild);
    }
}

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
    questionBoxElement.classList.add('hide');       
    nextButton.classList.remove("hide");            
    if (shuffledQuestions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove('hide')
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
    timeLeft ="";
    timerEl.textContent = "";

    questionBoxElement.classList.add('hide');   // hide questions
    answerBtnElement.classList.add('hide');     // hide answer btn choices
    nextButton.classList.add('hide');           // hide next btn
    endBoxElement.classList.remove('hide');     // show endBox

    formEl.addEventListener("submit", (event) => {
        event.preventDefault();
        var userInput = document.querySelector("input[name='Initials']").value;
        console.log(userInput);
        localStorage.setItem("User", userInput);

        //getting highscore
        var userScore = {
            initials: userInput,
            score: finalScore
        };
        
        var finalInfo = JSON.parse(localStorage.getItem("finalInfo")) || [];
        finalInfo.push(userScore);
        localStorage.setItem("finalInfo", JSON.stringify(finalInfo));
        showScores();
    })
}

function showScores() {
    formEl.remove();
    startButton.innerText= "Restart";
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
    questionBoxElement.classList.remove('hide');   
    answerBtnElement.classList.remove('hide');     
    nextButton.classList.remove('hide');           
    endBoxElement.classList.add('hide'); 
    timeLeft = 60;    
}

var questions = [
    {
        question: "Which of the following is not considered a JavaScript pop-up box?",
        answers: [
            {text: "Alert box", correct: false},
            {text: "Flex box", correct: true},
            {text: "Confirm box", correct: false},
            {text: "Prompt box", correct: false}
        ]
    },
    {
        question: "When using flexbox, which of the following will move the box vertically?",
        answers: [
            {text: "display: flex", correct: false},
            {text: "justify content", correct: false},
            {text: "align-items", correct: true},
            {text: "flex-direction", correct: false}
        ]
    },
    {
        question: "Which of the following is not a JavaScript Operator?",
        answers: [
            {text: "*", correct: false},
            {text: "%", correct: false},
            {text: "+", correct: false},
            {text: "!", correct: true}
        ]
    },
    {
        question: "Which of the following DOM is used to find and element by its ID?",
        answers: [
            {text: "getElementById()", correct: true},
            {text: "getElement()", correct: false},
            {text: "createElement()", correct: false},
            {text: "getId()", correct: false}
        ]
    },
    {
        question: "Which of the following is not a Javascript conditional statement?",
        answers: [
            {text: "if", correct: false},
            {text: "or", correct: true},
            {text: "else", correct: false},
            {text: "switch", correct: false}
        ]
    },      
]