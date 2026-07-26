class Ball{
    x;
    y;
    velocity;
    vx;
    vy;
    angle;
    ballRadius;
    name;

    changeDirection(width, height){
        if(this.x + this.vx > width - this.ballRadius || this.x + this.vx < this.ballRadius ){
            this.vx = -(this.vx);
            this.angle = Math.PI - this.angle;
         }
         if(this.y + this.vy > height - this.ballRadius || this.y + this.vy < this.ballRadius){
             this.vy = -(this.vy);
             this.angle = -this.angle;
         }
     }

    increasePos(){
        this.x += this.vx;
        this.y += this.vy;
    }

    constructor(width, height, name){
        this.name = name;
        this.ballRadius = 0.025 * canvas.height;
        this.x = this.ballRadius + Math.random() * (canvas.width - this.ballRadius * 2);
        this.y = this.ballRadius + Math.random() * (canvas.height - this.ballRadius * 2);
        this.velocity = 9;
        this.angle = randAngle();
        this.vx = this.velocity * Math.cos(this.angle);
        this.vy = this.velocity * Math.sin(this.angle);
    }


    drawBall(color){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.ballRadius, 0, Math.PI * 2);

        ctx.fillStyle = `${color}`;
        ctx.fill();

        let fontSize = 0.03 * canvas.height;
        const fontFamily = "'JetBrains Mono', monospace";
        ctx.font = `${fontSize}px ${fontFamily}`;
        ctx.fillStyle = 'white';

        ctx.textAlign = 'center';
        ctx.fillText(this.name, this.x, this.y);

        ctx.closePath();
    }

    changeVelocities(){
        this.vx = this.velocity * Math.cos(this.angle);
        this.vy = this.velocity * Math.sin(this.angle);
    }

}


const introDiv = document.getElementById('intro');
const startBtn = document.getElementById('starting');
const gameDiv = document.getElementById('game');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext("2d");
const answerDiv = document.getElementById("answer");

const answerParagraph = document.getElementById("answerP");
const yourAnswerParagraph = document.getElementById("yourAnswerP");
const modeParagraph = document.getElementById("modeP");

const answerBtn = document.getElementById("answerBtn");
const inputAnswer = document.getElementById("answerInput");

let levelNumh1 = document.getElementById("levelNum");
let levelNum = parseInt(levelNumh1.textContent);

const chevronUp = document.getElementById("chevronUp");
const chevronDown = document.getElementById("chevronDown");

const nextGameBtn = document.getElementById("nextGameBtn");
const closeX = document.getElementById("closeX");

/*
const leAudio = new Audio('assets/song.mp3')
leAudio.loop = true;
leAudio.muted = true;
*/

const ballList = [];
const sequenceList = [];
const orderList = [];
let numList = [];
let upCharList = [];
let lowCharList = [];
let listLength = 0;
let currentIndex = 0;

let numOfFrames = -1;
let visitedFrames = 0;
let diffBall = 0;

let drawID;


function clearAllArrays(){
    ballList.length = 0;
    sequenceList.length = 0;
    orderList.length = 0;
    numList.length = 0;
    upCharList.length = 0;
    lowCharList.length = 0;
}


function randAngle(){
    return Math.random() * (2*Math.PI);
}

function ballCollision(ball1, ball2){
    let dx = ball2.x - ball1.x;
    let dy = ball2.y - ball1.y;
    let angle = Math.atan2(dy, dx);
    let newVecAngle1 = ball1.angle - angle;
    let newVecAngle2 = ball2.angle - angle;

    let antiStickySit = (ball1.ballRadius + ball2.ballRadius - Math.sqrt((dx * dx) + (dy * dy)))/2;
    ball2.x += antiStickySit * Math.cos(angle);
    ball2.y += antiStickySit * Math.sin(angle);
    ball1.x -= antiStickySit * Math.cos(angle);
    ball1.y -= antiStickySit * Math.sin(angle);


    let parallelV1 = ball1.velocity * Math.cos(newVecAngle1);
    let perpV1 = ball1.velocity * Math.sin(newVecAngle1);
    let parallelV2 = ball2.velocity * Math.cos(newVecAngle2);
    let perpV2 = ball2.velocity * Math.sin(newVecAngle2);

    ball1.velocity = Math.sqrt(Math.pow(perpV1, 2) + Math.pow(parallelV2, 2));
    ball2.velocity = Math.sqrt(Math.pow(perpV2, 2) + Math.pow(parallelV1, 2));


    ball1.angle = Math.atan2(perpV1, parallelV2) + angle;
    ball2.angle = Math.atan2(perpV2, parallelV1) + angle;

    ball1.changeVelocities();
    ball2.changeVelocities();

}

function checkCollision(ball1, ball2){
    let ballCenterDist = Math.sqrt(Math.pow(ball1.x - ball2.x, 2) + Math.pow(ball1.y - ball2.y, 2));
    if(ballCenterDist <= (ball1.ballRadius + ball2.ballRadius)){
        return true;
    }else{
        return false;
    }
}

function checkBallCollision(ballList){
    for(let i = 0; i < ballList.length - 1; i++){
        for(let j = i + 1; j < ballList.length; j++){
            if(checkCollision(ballList[i], ballList[j])){
                ballCollision(ballList[i], ballList[j]);
            }
        }
    }
}

function LeArrayOnP(arr, paragraph){
    for(let i = 0; i < arr.length; i++){
        paragraph.append(`${arr[i]}`);
    }
}

function leAnswerFunc(){
        numList = LeMergeSort(numList, 0, numList.length-1);
        upCharList = LeMergeSort(upCharList, 0, upCharList.length-1);
        lowCharList = LeMergeSort(lowCharList, 0, lowCharList.length-1)
        gameCanvas.classList.toggle('hidden');
        answerDiv.style.display = 'flex';

        let permutation = Math.floor(Math.random() * 3);
        switch(permutation){
            case 0:
                modeParagraph.textContent = "0Aa";
                LeArrayOnP(numList, answerParagraph);
                LeArrayOnP(upCharList, answerParagraph);
                LeArrayOnP(lowCharList, answerParagraph);
                break;
            case 1:
                modeParagraph.textContent = "A0a";
                LeArrayOnP(upCharList, answerParagraph);
                LeArrayOnP(numList, answerParagraph);
                LeArrayOnP(lowCharList, answerParagraph);
                break;
            case 2:
                modeParagraph.textContent = "Aa0";
                LeArrayOnP(upCharList, answerParagraph);
                LeArrayOnP(lowCharList, answerParagraph);
                LeArrayOnP(numList, answerParagraph);
                break;
            default:
                break;
        }

}


function leToggleAnswerDiv(){

    answerBtn.classList.toggle('hidden');
    inputAnswer.classList.toggle('hidden');
   
    closeX.classList.toggle('hidden');
    nextGameBtn.classList.toggle('hidden');
    answerP.classList.toggle('hidden');
    yourAnswerP.classList.toggle('hidden');
}

function leCheckAnswer(answerP, yourAnswerP){
    const pText = answerP.textContent;
    const inputText = inputAnswer.value;
    leToggleAnswerDiv();
    yourAnswerP.append(inputText);

    if(pText === inputText){
        yourAnswerP.classList.remove('wrongAnswer');
        yourAnswerP.classList.add('correctAnswer');
        leLevel(1);
    }else{
        yourAnswerP.classList.remove('correctAnswer');
        yourAnswerP.classList.add('wrongAnswer');
        leLevel(0);
    }

}

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(currentIndex >= listLength){
        
        leAnswerFunc();
        clearInterval(drawID);
        //return;

    }

    
    checkBallCollision(ballList);
    if(numOfFrames == -1){
        for(let i = 0; i < ballList.length; i++){
            if(Math.floor(Math.random() * 20 * ballList.length) == 2 && numOfFrames == -1){
                numOfFrames = 3 + Math.floor(Math.random() * 18);
                diffBall = i;
            }
            ballList[i].changeDirection(canvas.width, canvas.height);
            ballList[i].drawBall('green');
            ballList[i].increasePos();
        } 
    }else{
        for(let i = 0; i < ballList.length; i++){
            ballList[i].changeDirection(canvas.width, canvas.height);
            if(diffBall != i){
                ballList[i].drawBall('green');
            }else{
                ballList[i].drawBall('black');
            }
            ballList[i].increasePos();
        }
        if(visitedFrames == numOfFrames){
            visitedFrames = 0;
            numOfFrames = -1;
            if(ballList[diffBall].name >= 'A' && ballList[diffBall].name <= 'Z'){
                upCharList.push(ballList[diffBall].name);
            }else if(ballList[diffBall].name >= 'a' && ballList[diffBall].name <= 'z'){
                lowCharList.push(ballList[diffBall].name);
            }else{
                numList.push(ballList[diffBall].name)
            }
            orderList.push(ballList[diffBall].name);
            currentIndex++;
        }else{
            visitedFrames++;
        }
    }
}

function LeMergeSort(list, left, right){
    if(right - left < 0){
        console.log("empty or erroneous list");
        return [];
    }
    if(left == right){
        return [list[left]];
    }
    let middle = Math.floor((left + right)/2);
    let x = LeMergeSort(list, (middle+1), right);
    let y = LeMergeSort(list, left, middle);
    const mergedList = [];
    let i = 0;
    let j = 0;
    while(i < x.length && j < y.length){
        if(x[i] <= y[j]){
            mergedList.push(x[i]);
            i++;
        } else{
            mergedList.push(y[j]);
            j++;
        }
    }
    if(i == x.length){
        for(let w = j; w < y.length; w++){
            mergedList.push(y[w]);
        }
    }else{
        for(let w = i; w < x.length; w++){
            mergedList.push(x[w]);
        }
    }
    return mergedList;
}

function resizeCanvas(){
    const wrapperWidth = gameDiv.clientWidth;
    const wrapperHeight = gameDiv.clientHeight;

    const dpr = window.devicePixelRatio || 1;


    console.log(`${wrapperWidth} and ${wrapperHeight}, first`);

    canvas.width = wrapperWidth * dpr;
    canvas.height = wrapperHeight * dpr;

    ctx.scale(dpr, dpr);


    console.log(`${canvas.width} and ${canvas.height}, second`);
}



function ballSelection(number){
    for(let i = 0; i < number; i++){
        let choice = Math.floor(Math.random() * 3);
        let ball;
        switch(choice){
            case 0:
                ball = new Ball(canvas.width, canvas.height, String.fromCharCode(Math.floor(48 + Math.random() * 10)));
                break;
            case 1:
                ball = new Ball(canvas.width, canvas.height, String.fromCharCode(Math.floor(65 + Math.random() * 26)));

                break;
            case 2:
                ball = new Ball(canvas.width, canvas.height, String.fromCharCode(Math.floor(97 + Math.random() * 26)));

                break;
        }
        ballList.push(ball);
    }
}

window.addEventListener('resize', ()=>{
    resizeCanvas();
});

function startGame(){
    clearAllArrays();
    yourAnswerParagraph.textContent = 'Your answer is:';
    answerParagraph.textContent = '';
    inputAnswer.value = '';
    currentIndex = 0;
    listLength = levelNum;
    ballSelection(21);
    drawID = setInterval(draw, 50);
}


function leLevel(winOrLoss){
    if(winOrLoss == 1){
        levelNum++;
    }else{
        if(levelNum > 1){
            levelNum--;
        }
    }
    levelNumh1.textContent = levelNum;
}

answerBtn.addEventListener('click', ()=>{
    leCheckAnswer(answerParagraph, yourAnswerParagraph);
});

inputAnswer.addEventListener('keydown', function(event){
    if(event.key == "Enter"){
        leCheckAnswer(answerParagraph, yourAnswerParagraph);
    }
});

startBtn.addEventListener('click', ()=>{
    introDiv.classList.toggle('hidden');
    gameDiv.classList.toggle('hidden');
    answerDiv.style.display = 'none';
    resizeCanvas();
    startGame();
});


chevronDown.addEventListener('click', ()=>{
    if(levelNum > 1){
        leLevel(0);
    }
});
chevronUp.addEventListener('click', ()=>{
    leLevel(1);
});

nextGameBtn.addEventListener('click', ()=>{
    leToggleAnswerDiv();
    answerDiv.style.display = 'none';
    gameCanvas.classList.toggle('hidden');
    startGame();
});

closeX.addEventListener('click', ()=>{
    leToggleAnswerDiv();
    introDiv.classList.toggle('hidden');
    answerDiv.style.display = 'none';
    gameCanvas.classList.toggle('hidden');
    gameDiv.classList.toggle('hidden');
    closeX.classList.toggle('hidden');
});

/*
const toggleMute = () =>{
    leAudio.muted = !leAudio.muted;
}

window.addEventListener('DOMContentLoaded', ()=>{
        document.addEventListener('keydown', (event) =>{
        if(event.key !== 'm') {
            return;
        }

        const activeElement = document.activeElement;

        const forbiddenTags = ['INPUT', 'TEXTAREA', 'SELECT'];

        const isTyping = forbiddenTags.includes(activeElement.tagName) || activeElement.isContentEditable;

        if(isTyping){
            return;
        }
        if(leAudio.paused){
            leAudio.play();
        }
        toggleMute();

        event.preventDefault();
    });

});*/
