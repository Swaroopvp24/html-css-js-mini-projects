let userScore = 0;
let compScore = 0;
let resetBtn = document.querySelector("#reset-btn");
const choices = document.querySelectorAll(".choice");
const msg = document.querySelector("#msg");
const userScPara = document.querySelector("#user-score");
const compScPara = document.querySelector("#comp-score");


const genCompChoice = () => {
    const options = ["rock", "paper", "scissors"];
    const randIndex = Math.floor(Math.random() * 3);
    return options[randIndex];
};


const drawGame = () => {
    msg.innerText = `The game was draw!`;
    msg.style.backgroundColor = "#081b31";
};


const showWinner = (userwin, userChoice, compChoice) => {
    if (userwin == true) {
        userScore++;
        msg.innerText = `You win! Your ${userChoice} beats ${compChoice}`;
        msg.style.backgroundColor = "green";
        userScPara.innerText = `${userScore}`;
    }
    else {
        compScore++;
        msg.innerText = `Computer win! ${compChoice} beats your ${userChoice}`;
        msg.style.backgroundColor = "red";
        compScPara.innerText = `${compScore}`;
    }
};


const playGame = (userchoice) => {

    const compChoice = genCompChoice();

    if (compChoice === userchoice) {
        drawGame();
    }
    else {
        let userWin = true;
        if (userchoice === "rock") {
            userWin = compChoice === "paper" ? false : true;
        }
        else if (userchoice === "paper") {
            userWin = compChoice === "scissors" ? false : true;
        }
        else {
            userWin = compChoice === "rock" ? false : true;
        }
        showWinner(userWin, userchoice, compChoice);
    }
};


choices.forEach((choice) => {
    choice.addEventListener("click", () => {
        const choiceId = choice.getAttribute("id");
        playGame(choiceId);
    });
});


resetBtn.addEventListener("click", () => {
    userScore = 0;
    compScore = 0;
    compScPara.innerText = `${userScore}`;
    userScPara.innerText = `${compScore}`;
    msg.innerText = `Play your move`;
    msg.style.backgroundColor = "#081b31";
});
