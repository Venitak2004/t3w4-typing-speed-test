console.log("Typing Speed Test Begins.")
// Global Variables so no cache stores, refreshed
let correctCharacters = 0;
let totalCharacters = 0;
let startTime;
let timer=10; // Time in seconds (adjustable)
let timerInterval;



// Element Selectors
const playButton = document.getElementById("playButton");
const sentenceDisplay = document.getElementById("sentenceDisplay");
const inputField = document.getElementById("inputField");
const resultsSection = document.getElementById("resultsSection");
const timerDisplay = document.getElementById("timerDisplay");


// Sentence Fetching
async function getRandomSentence(wordCount){
    try {
    const response = await fetch(`https://random-word-api.herokuapp.com/word?number=${wordCount}`);
    const data = await response.json();
    // shortcut to join elements in an array into a sentence
    let sentence = data.join(' ');
    console.log(sentence);
    return sentence;
    } catch (error) {;
    console.error("Failed to fetch sentence: ", error);
    return "Error Loading sentence, please try again."
    }
}

async function displaySentence() {
    // Fetch sentence with 10 words
    const randomSentence = await getRandomSentence(10);
    // Display the words in the HTML content
    sentenceDisplay.textContent = randomSentence;
}
// Event Listeners
playButton.addEventListener('click', startGame);
inputField.addEventListener('input', trackTyping);

// Start the game.
function startGame() {
    // Reset game variables and UI ELements
    correctCharacters = 0;
    totalCharacters = 0;
    inputField.value = '';
    // refreshes the results on start button
    resultsSection.innerHTML = ' ';
    startTime = null;
    displaySentence();
  
    // Show necessary element fields once start button is clicked
    inputField.style.display = 'block';
    sentenceDisplay.style.display = 'block';
    timerDisplay.style.display = 'block';
}

function startTimer() {
    timerInterval = setInterval(() => {
    if (timer > 0) {
        timer --;
        timerDisplay.textContent = `Time Left: ${timer}'s`;
    }
    else {
        endGame();
    }
    }, 1000);

}

//Typing and tracking functions
function trackTyping(){
    // console.log(startTime);
    // Starts the timer when begins
    if (!startTime) {
        //Record start time on first input in the text field
        startTime = new Date();
        console.log("time set: ",startTime)
        startTimer();
    }
         
    const typeText = inputField.value;
    const sentence = sentenceDisplay.textContent;

    totalCharacters = typeText.length;
    correctCharacters = countCorrectCharacters(typeText, sentence);
    
    if (typeText === sentence){;
    // end the game if user finishes early.
    endGame();
    }
    updateStats();
}

function countCorrectCharacters(typeText, sentence){
    let correct = 0;
    const minLength = Math.min(typeText.length, sentence.length);
    for (let i =0; i < minLength; i++) {
        if (typeText[i] === sentence[i]){
            correct++;
        }
    }
    console.log(correct);
    return correct;
}

function updateStats(){
    const wpm = calculateWPM();
    const accuracy = Math.floor(correctCharacters / totalCharacters) * 100;
    // console.log("Accuracy: ", accuracy );
    displayResults(wpm, accuracy);
}

function displayResults(wpm, accuracy) {
    resultsSection.innerHTML = `WPM: ${wpm} | Accuracy: ${accuracy}%`;

}
// Calculate the words typed per minute
function calculateWPM(){
    const timeElapsed = (new Date() - startTime) / 1000;
    // console.log("Time in seconds: ", timeElapsed);
    // console.log("Time in mins: ",(timeElapsed / 60));
    // Return the correct words per minute
    wpm = Math.floor((correctCharacters / 5) /  (timeElapsed / 60));
    console.log("Words Per Min: ", wpm);
    return wpm
}

function endGame(){
    // Stop the timer
    clearInterval(timerInterval);

    // Disable the input field after the game ends.
    inputField.style.display = 'none';
        
    // Calculate the final accuracy
    const accuracy =  Math.floor((correctCharacters / totalCharacters) * 100);
        
    resultsSection.innerHTML = `<p>Game Over! Your Final WPM: ${wpm} | Accuracy: ${accuracy}%</p>`;

}

