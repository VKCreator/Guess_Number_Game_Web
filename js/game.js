"use strict";

let stateGame = {
    state: "OK",
    guessComputerNumber: null,
    maxVal: null,
    minVal: null,
    maxLength: null,
    attemptsCount: null,
};

window.addEventListener('DOMContentLoaded', initGame);
window.addEventListener('DOMContentLoaded', settingsElements);

function initGame() {
    let startNumberElement = document.getElementById("startNumber");
    let finishNumberElement = document.getElementById("finishNumber");
    let attemptsCountElement = document.getElementById("attemptsCount");
    let inputGuessNumber = document.getElementById("typeNumberGuess");

    let randomStartNumber = 1 + Math.floor(Math.random() * 500);
    let randomFinishNumber = randomStartNumber + 1 + Math.floor(Math.random() * 500);

    startNumberElement.textContent = randomStartNumber;
    finishNumberElement.textContent = randomFinishNumber;
    attemptsCountElement.textContent = Math.ceil(Math.log2(randomFinishNumber - randomStartNumber + 1));
    stateGame.attemptsCount = +attemptsCountElement.textContent;

    stateGame.guessComputerNumber = randomStartNumber + Math.floor(Math.random() * (randomFinishNumber - randomStartNumber + 1));

    // document.activeElement.blur();
    inputGuessNumber.classList.remove("is-invalid");
    inputGuessNumber.classList.remove("is-valid");
    inputGuessNumber.removeAttribute("disabled");
    inputGuessNumber.value = "";
    inputGuessNumber.focus();

    document.getElementById("infoAboutTry").textContent = "Здесь отображаются результаты вашей попытки!";
    stateGame.maxVal = randomFinishNumber;
    stateGame.minVal = randomStartNumber; 
    stateGame.maxLength = finishNumberElement.textContent.length;

    document.getElementById("guessButton").setAttribute("disabled","true");

    let containerInfoEl = document.getElementsByClassName("containerInfo")[0];
    containerInfoEl.classList.remove("winnerStyle");
    containerInfoEl.classList.remove("loseStyle");
}

function settingsElements() {
    let inputGuessNumber = document.getElementById("typeNumberGuess");
    let guessButtonEl = document.getElementById("guessButton");

    document.getElementById("startGame").addEventListener("click", initGame);

    inputGuessNumber.addEventListener("keyup", processUserTry);
    inputGuessNumber.addEventListener("input", checkUserValue);

    // guessButtonEl.addEventListener("keyup", processUserTry);
    guessButtonEl.addEventListener("click", processUserTry);
}

function processUserTry(e) {

    let inputEl = document.getElementById("typeNumberGuess");

    if (stateGame.state == "OK" && inputEl.value != "") {
        let activeEl = document.activeElement;
        let infoEl = document.getElementById("infoAboutTry");

        if ((activeEl === inputEl || activeEl === document.getElementById("guessButton")) && (e.key === "Enter" || e.type === "click")) {
        let userValue = +inputEl.value;

        if (userValue > stateGame.guessComputerNumber) {
                infoEl.textContent = `Загаданное число меньше ${userValue}.`;
        }
        else if (userValue < stateGame.guessComputerNumber) {
                infoEl.textContent = `Загаданное число больше ${userValue}.`;
        }
        else {
                win();
                return;
        }
        stateGame.attemptsCount--;

        if (!stateGame.attemptsCount) {
                gameOver();
        }
        else {
            infoEl.textContent += ` Количество оставшихся попыток: ${stateGame.attemptsCount}.`;
        }
        }
    } 
}

function win() {
    let infoEl = document.getElementById("infoAboutTry");

    infoEl.textContent = `Вы угадали! Это число: ${stateGame.guessComputerNumber}.`;
    document.getElementsByClassName("containerInfo")[0].classList.add("winnerStyle");

    finishGame();
}

function gameOver() {
    let infoEl = document.getElementById("infoAboutTry");

    infoEl.textContent = `Вы проиграли! Загаданное число: ${stateGame.guessComputerNumber}.`;
    document.getElementsByClassName("containerInfo")[0].classList.add("loseStyle");

    finishGame();
}

function finishGame() {
    document.getElementById("typeNumberGuess").setAttribute("disabled", "disabled");
    document.getElementById("guessButton").setAttribute("disabled", "disabled");
    document.getElementById("startGame").focus();
}

function isNumber(val) 
{
    return val != "" && val % 1 == 0; // type="number"
}

function checkUserValue(event)
{
    let val = event.target.value;
    let buttonGuess = document.getElementById("guessButton");
    let inputEl = document.getElementById("typeNumberGuess");

    if (val.length > stateGame.maxLength) 
    {
        event.target.value = val.slice(0, stateGame.maxLength);
        val = event.target.value;
    }

    if (!isNumber(val) || +val > stateGame.maxVal || +val < stateGame.minVal) 
    {
       stateGame.state = "ERROR";
       event.target.classList.add("is-invalid")
       buttonGuess.setAttribute("disabled","true")
       inputEl.title = "Вводить строки запрещено или число вне диапазона!";
    }
    else 
    {
        stateGame.state = "OK";
        event.target.classList.add("is-valid");
        event.target.classList.remove("is-invalid");
        buttonGuess.removeAttribute("disabled","");
        inputEl.title = "";
    }
}