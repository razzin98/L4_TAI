let next = document.querySelector('.next');
let previous=document.querySelector('.previous');

let question = document.querySelector('.question');
let answers = document.querySelectorAll('.list-group-item');

let pointsElem = document.querySelector('.score');
let restart = document.querySelector('.restart');
let index = 0;
let points = 0;

let list = document.querySelector('.list');
let results = document.querySelector('.results');
let userScorePoint = document.querySelector('.userScorePoint');
let averagePoints = document.querySelector('.average');
let preQuestions = null;

document.querySelector('#index').innerHTML=index+1;
//setQuestion(0);
fetch('https://quiztai.herokuapp.com/api/quiz')
    .then(resp => resp.json())
    .then(resp => {
        preQuestions = resp;
        setQuestion(index);
    });

for (let i = 0; i < answers.length; i++) {
    answers[i].addEventListener('click', doAction);
}

function activateAnswers() {
    for (let i = 0; i < answers.length; i++) {
        answers[i].addEventListener('click', doAction);
    }
}

function disableAnswers() {
    for (let i = 0; i < answers.length; i++) {
        answers[i].removeEventListener('click', doAction);
    }
}

activateAnswers();

function markCorrect(elem) {
    elem.classList.add('correct');
}
function markIncorrect(elem) {
    elem.classList.add('incorrect');
}


function doAction(event) {
    //event.target - Zwraca referencję do elementu, do którego zdarzenie zostało pierwotnie wysłane.
    if (event.target.innerHTML === preQuestions[index].correct_answer) {
        points++;
        pointsElem.innerText = points;
        markCorrect(event.target);
    }
    else {
        markIncorrect(event.target);
    }

    disableAnswers();
}

function clearAnswers(){
    for(let i=0;i<answers.length;i++){
        let elem=answers[i];
        if(elem.classList.contains('correct')){
            elem.classList.remove('correct');
        }
        else if(elem.classList.contains('incorrect')){
            elem.classList.remove('incorrect');
        }
    }
}

restart.addEventListener('click', function (event) {
    event.preventDefault();

    index = 0;
    points = 0;
    let userScorePoint = document.querySelector('.score');
    userScorePoint.innerHTML = points;
    setQuestion(index);
    activateAnswers();
    list.style.display = 'block';
    results.style.display = 'none';

});

function setQuestion(index) {
    clearAnswers();

    question.innerHTML = preQuestions[index].question;

    answers[0].innerHTML = preQuestions[index].answers[0];
    answers[1].innerHTML = preQuestions[index].answers[1];
    answers[2].innerHTML = preQuestions[index].answers[2];
    answers[3].innerHTML = preQuestions[index].answers[3];

    document.querySelector('#index').innerHTML=index+1;
   if (preQuestions[index].answers.length === 2) {
       answers[2].style.display = 'none';
       answers[3].style.display = 'none';
   } else {
       answers[2].style.display = 'block';
       answers[3].style.display = 'block';
   }

}


function endgame(){
    let avg_result =0;
    let number_of_games = JSON.parse(localStorage.getItem("games"));
    let scores = JSON.parse(localStorage.getItem("scores"));
    if (number_of_games === null) {
        number_of_games = 1;
    } else {number_of_games++;}

    localStorage.setItem("games", JSON.stringify(number_of_games));
    console.log("Liczba dotychczasowych gier: "+number_of_games);

    if (scores === null) { scores = points; }
    else { scores+=points; }

    avg_result = scores / number_of_games;
    localStorage.setItem("results", JSON.stringify(avg_result));
    console.log("Srednia punktów: "+avg_result);


    list.style.display = 'none';
    results.style.display = 'block';
    userScorePoint.textContent = points;
    averagePoints.textContent=avg_result;
}

next.addEventListener('click', function () {
    if (index !== preQuestions.length-1) {
        index++;
        setQuestion(index);
        activateAnswers();
    } else {
        endgame();
    }
});

previous.addEventListener('click', function () {
    if (index === 0);
    else {
        index--;
        setQuestion(index);
        disableAnswers();
    }
});

