let display = document.getElementById("display");
let progress = document.getElementById("progress");

let startBtn = document.getElementById("start");
let pauseBtn = document.getElementById("pause");
let resetBtn = document.getElementById("reset");
let lapBtn = document.getElementById("lap");
let exportBtn = document.getElementById("exportBtn");
let themeBtn = document.getElementById("themeBtn");

let lapsList = document.getElementById("laps");

let startTime = 0;
let elapsedTime = 0;
let timerInterval;
let running = false;

const circumference = 879;

function updateTime(){

    elapsedTime = Date.now() - startTime;

    let ms = elapsedTime % 1000;

    let totalSeconds = Math.floor(elapsedTime/1000);

    let hrs = Math.floor(totalSeconds/3600);

    let mins = Math.floor((totalSeconds%3600)/60);

    let secs = totalSeconds%60;

    display.innerText =
        `${String(hrs).padStart(2,'0')}:`+
        `${String(mins).padStart(2,'0')}:`+
        `${String(secs).padStart(2,'0')}:`+
        `${String(ms).padStart(3,'0')}`;

    let offset = circumference -
        ((secs % 60)/60)*circumference;

    if (progress) {
    progress.style.strokeDashoffset = offset;
}
}

function startTimer(){

    if(running) return;

    running = true;

    startTime = Date.now() - elapsedTime;

    timerInterval = setInterval(updateTime,10);
}

function pauseTimer(){

    running = false;

    clearInterval(timerInterval);
}

function resetTimer(){

    running = false;

    clearInterval(timerInterval);

    elapsedTime = 0;

    display.innerText="00:00:00:000";

    if (progress) {
    progress.style.strokeDashoffset = circumference;
}
    lapsList.innerHTML="";
}

function addLap(){

    if(elapsedTime===0) return;

    let li=document.createElement("li");

    li.innerText=
    `Lap ${lapsList.children.length+1} - ${display.innerText}`;

    lapsList.prepend(li);
}

function exportCSV(){

    let rows=["Lap Time"];

    [...lapsList.children].forEach(lap=>{
        rows.push(lap.innerText);
    });

    let csvContent = rows.join("\n");

    let blob = new Blob([csvContent],
    {type:"text/csv"});

    let url = URL.createObjectURL(blob);

    let a = document.createElement("a");

    a.href=url;
    a.download="lap_times.csv";

    a.click();

    URL.revokeObjectURL(url);
}

function toggleTheme(){

    document.body.classList.toggle("light");

    if(document.body.classList.contains("light"))
        themeBtn.innerText="☀️ Light Mode";
    else
        themeBtn.innerText="🌙 Dark Mode";
}

startBtn.addEventListener("click",startTimer);
pauseBtn.addEventListener("click",pauseTimer);
resetBtn.addEventListener("click",resetTimer);
lapBtn.addEventListener("click",addLap);

if(exportBtn){
    exportBtn.addEventListener("click",exportCSV);
}

if(themeBtn){
    themeBtn.addEventListener("click",toggleTheme);
}

document.addEventListener("keydown",(e)=>{

    switch(e.key.toLowerCase()){

        case 's':
            startTimer();
            break;

        case 'p':
            pauseTimer();
            break;

        case 'r':
            resetTimer();
            break;

        case 'l':
            addLap();
            break;
    }
});