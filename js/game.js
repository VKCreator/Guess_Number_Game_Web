"use strict";

let stateGame = {
    "state": "OK",
    
}

let state = "OK";
let guessComputerNumber = null;
let maxVal = null;
let minVal = null;
let maxLength = null;
let attemptsCount = null;

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
    attemptsCount = +attemptsCountElement.textContent;

    guessComputerNumber = randomStartNumber + Math.floor(Math.random() * (randomFinishNumber - randomStartNumber + 1));

    // document.activeElement.blur();
    inputGuessNumber.classList.remove("is-invalid");
    inputGuessNumber.classList.remove("is-valid");
    inputGuessNumber.removeAttribute("disabled");
    inputGuessNumber.value = "";
    inputGuessNumber.focus();

    document.getElementById("infoAboutTry").textContent = "Здесь отображаются результаты вашей попытки!";
    maxVal = randomFinishNumber;
    minVal = randomStartNumber; 
    maxLength = finishNumberElement.textContent.length;

    document.getElementById("guessButton").setAttribute("disabled","true");
    document.getElementsByClassName("containerInfo")[0].classList.remove("winnerStyle");
    document.getElementsByClassName("containerInfo")[0].classList.remove("loseStyle");
}

function settingsElements() {
    document.getElementById("startGame").addEventListener("click", initGame);

    document.getElementById("typeNumberGuess").addEventListener("keyup", processUserTry);
    document.getElementById("typeNumberGuess").addEventListener("input", checkUserValue);

    document.getElementById("guessButton").addEventListener("keyup", processUserTry);
    document.getElementById("guessButton").addEventListener("click", processUserTry);
}

function processUserTry(e) {

    let inputEl = document.getElementById("typeNumberGuess");

    if (state == "OK" && inputEl.value != "") {
        let activeEl = document.activeElement;
        let infoEl = document.getElementById("infoAboutTry");

        if (activeEl === inputEl && e.key === "Enter" || 
        activeEl == document.getElementById("guessButton") && (e.type === "click" || e.key === "Enter") ) {
        let userValue = +inputEl.value;
        console.log(guessComputerNumber)
        if (userValue > guessComputerNumber) {
                infoEl.textContent = `Загаданное число меньше ${userValue}.`;
        }
        else if (userValue < guessComputerNumber) {
                infoEl.textContent = `Загаданное число больше ${userValue}.`;
        }
        else {
                win();
                return;
        }
        attemptsCount--;

        if (!attemptsCount) {
                gameOver();
        }
        else {
            infoEl.textContent += ` Количество оставшихся попыток: ${attemptsCount}.`;
        }
        }
    } 
}

function win() {
    let infoEl = document.getElementById("infoAboutTry");
    let inputEl = document.getElementById("typeNumberGuess");

    infoEl.textContent = `Вы угадали! Это число: ${guessComputerNumber}.`;
    document.getElementsByClassName("containerInfo")[0].classList.add("winnerStyle");

    inputEl.setAttribute("disabled", "disabled");
    document.getElementById("guessButton").setAttribute("disabled", "disabled");

    document.getElementById("startGame").focus();
}

function gameOver() {
    let infoEl = document.getElementById("infoAboutTry");
    let inputEl = document.getElementById("typeNumberGuess");

    infoEl.textContent = `Вы проиграли! Загаданное число: ${guessComputerNumber}.`;
    document.getElementsByClassName("containerInfo")[0].classList.add("loseStyle");

    inputEl.setAttribute("disabled", "disabled");
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

    if (val.length > maxLength) 
    {
        event.target.value = val.slice(0,maxLength);
        val = event.target.value;
    }

    if (!isNumber(val) || +val > maxVal || +val < minVal) 
    {
       state = "ERROR";
       event.target.classList.add("is-invalid")
       buttonGuess.setAttribute("disabled","true")
       inputEl.title = "Вводить строки запрещено или число вне диапазона!";
    }
    else 
    {
        state = "OK";
        event.target.classList.add("is-valid");
        event.target.classList.remove("is-invalid");
        buttonGuess.removeAttribute("disabled","");
        inputEl.title = "";
    }
}