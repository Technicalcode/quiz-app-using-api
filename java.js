const questionElement = document.querySelector("#question");
const answerButtons = document.querySelector("#answer-btns");
const nextButton = document.querySelector('#next-btn');
const loader = document.querySelector('#loader');
const categorySelect = document.querySelector('#category');
const startQuizBtn = document.querySelector('#start-quiz-btn');
const app = document.querySelector('.app');
const categorySelectContainer = document.querySelector('.category-select');

let currentQuestionIndex = 0;
let score = 0;
let questions = [];

startQuizBtn.addEventListener('click', () => {
    const selectedCategory = categorySelect.value;
    startQuiz(selectedCategory);
});

function startQuiz(category) {
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    showLoader();
    fetchQuestions(category);
}

function fetchQuestions(category) {
    const categoryMappings = {
        'programming': 18, // Computers category from OpenTDB
        'digital-marketing': 9, // General Knowledge as a placeholder
        'web-development': 18, // Computers category from OpenTDB
        'data-analysis': 9, // General Knowledge as a placeholder
        'cloud-computing': 18 // Computers category from OpenTDB
    };

    const categoryID = categoryMappings[category];
    
    fetch(`https://opentdb.com/api.php?amount=10&category=${categoryID}&type=multiple`)
        .then(response => response.json())
        .then(data => {
            questions = data.results.map(result => {
                let answers = [
                    { text: result.correct_answer, correct: true },
                    ...result.incorrect_answers.map(answer => ({ text: answer, correct: false }))
                ];
                answers = shuffleArray(answers); // Shuffle the answers

                return {
                    Question: result.question,
                    answer: answers
                };
            });
            hideLoader();
            showQuestion();
            app.classList.remove('hidden');
            categorySelectContainer.classList.add('hidden');
        })
        .catch(error => {
            console.error('Error fetching questions:', error);
            hideLoader();
        });
}

function showQuestion() {
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = `${questionNo}. ${currentQuestion.Question}`;

    currentQuestion.answer.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        answerButtons.appendChild(button);
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
    });
}

function resetState() {
    nextButton.style.display = "none";
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    if (isCorrect) {
        selectedBtn.classList.add("correct");
        score++;
    } else {
        selectedBtn.classList.add("incorrect");
    }
    Array.from(answerButtons.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        }
        button.disabled = true;
    });
    nextButton.style.display = "block";
}

function showScore() {
    resetState();
    questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
    nextButton.innerHTML = "Play Again";
    nextButton.style.display = "block";
}

function handleNextButton() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showScore();
    }
}

nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < questions.length) {
        handleNextButton();
    } else {
        categorySelectContainer.classList.remove('hidden');
        app.classList.add('hidden');
    }
});

function showLoader() {
    loader.classList.remove("hidden");
}

function hideLoader() {
    loader.classList.add("hidden");
}

// Utility function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
