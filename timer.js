// 计时功能
let timerInterval = null;
let timeLeft = 10;

function startTimer(callback) {
    timeLeft = 10;
    document.getElementById('timer').textContent = timeLeft;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            callback();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function resetTimer() {
    clearInterval(timerInterval);
    timeLeft = 10;
    document.getElementById('timer').textContent = timeLeft;
}
