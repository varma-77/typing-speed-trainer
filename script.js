const textDisplay = document.getElementById('textDisplay');
const inputField = document.getElementById('inputField');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const timerDisplay = document.getElementById('timer');
const resultsDiv = document.getElementById('results');
const finalWpm = document.getElementById('finalWpm');
const finalAccuracy = document.getElementById('finalAccuracy');
const wordsTyped = document.getElementById('wordsTyped');

const sampleTexts = [
    "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet.",
    "Typing faster requires practice and focus. Start with simple texts and gradually increase difficulty.",
    "Accuracy is more important than speed when learning to type. Build good habits from the beginning.",
    "Technology has changed how we communicate. Typing skills remain essential in the digital age.",
    "Programming requires clear thinking and attention to detail. Every character matters in code.",
    "Learning to type efficiently can improve productivity and reduce fatigue during long work sessions.",
    "The internet connects billions of people across the globe. Communication happens at the speed of thought.",
    "JavaScript is a powerful language for web development. It powers interactive experiences on the web."
];

let currentText = '';
let isTestActive = false;
let timeLeft = 60;
let timerInterval = null;
let startTime = null;

function getRandomText() {
    return sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
}

function updateDisplay() {
    textDisplay.innerHTML = '';
    const inputText = inputField.value;
    
    for (let i = 0; i < currentText.length; i++) {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = currentText[i];
        
        if (i < inputText.length) {
            if (inputText[i] === currentText[i]) {
                span.classList.add('correct');
            } else {
                span.classList.add('incorrect');
            }
        } else if (i === inputText.length) {
            span.classList.add('current');
        }
        
        textDisplay.appendChild(span);
    }
}

function calculateStats() {
    const inputText = inputField.value;
    const typedWords = inputText.trim().split(/\s+/).length;
    const elapsedSeconds = (Date.now() - startTime) / 1000;
    const elapsedMinutes = elapsedSeconds / 60;
    const wpm = Math.round((typedWords / elapsedMinutes) * 10) / 10;
    
    let correctChars = 0;
    for (let i = 0; i < inputText.length; i++) {
        if (i < currentText.length && inputText[i] === currentText[i]) {
            correctChars++;
        }
    }
    
    const totalChars = Math.max(inputText.length, 1);
    const accuracy = Math.round((correctChars / totalChars) * 100);
    
    return { wpm, accuracy, typedWords };
}

function updateStats() {
    if (!isTestActive) return;
    
    const { wpm, accuracy } = calculateStats();
    wpmDisplay.textContent = Math.max(0, wpm);
    accuracyDisplay.textContent = accuracy + '%';
}

function startTimer() {
    startTime = Date.now();
    timeLeft = 60;
    timerDisplay.textContent = timeLeft + 's';
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft + 's';
        
        if (timeLeft <= 0) {
            endTest();
        }
    }, 1000);
}

function endTest() {
    isTestActive = false;
    clearInterval(timerInterval);
    inputField.disabled = true;
    startBtn.disabled = false;
    
    const { wpm, accuracy, typedWords } = calculateStats();
    
    finalWpm.textContent = Math.max(0, wpm);
    finalAccuracy.textContent = accuracy;
    wordsTyped.textContent = typedWords;
    resultsDiv.style.display = 'block';
}

function startTest() {
    currentText = getRandomText();
    inputField.value = '';
    inputField.disabled = false;
    inputField.focus();
    
    isTestActive = true;
    startBtn.disabled = true;
    resultsDiv.style.display = 'none';
    
    updateDisplay();
    startTimer();
}

function resetTest() {
    isTestActive = false;
    clearInterval(timerInterval);
    
    inputField.value = '';
    inputField.disabled = true;
    startBtn.disabled = false;
    
    currentText = '';
    timeLeft = 60;
    timerDisplay.textContent = '60s';
    wpmDisplay.textContent = '0';
    accuracyDisplay.textContent = '100%';
    textDisplay.innerHTML = '';
    resultsDiv.style.display = 'none';
}

startBtn.addEventListener('click', startTest);
resetBtn.addEventListener('click', resetTest);

inputField.addEventListener('input', () => {
    if (isTestActive) {
        updateDisplay();
        updateStats();
        
        if (inputField.value.length === currentText.length) {
            endTest();
        }
    }
});

resetTest();