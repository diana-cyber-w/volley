const $pong = $('#pong');
const $playerPadel = $('#player-padel');
const $aiPadel = $('#ai-padel');
const $ball = $('#ball');
const $start = $('#start');

const UP_LEFT = -3 * Math.PI / 4;
const UP_RIGHT = -Math.PI / 4;
const DOWN_LEFT = 3 * Math.PI / 4;
const DOWN_RIGHT = Math.PI / 4;
let interval = null;
let aiPadel = null;
let ball = null;
let interval2 = null;
$start.click(function() {
    init();
})
this.timenotourRemaining = 0;
this.timeourRemaining = 0;
var mismatchSound = new Audio('audio/6_sto-k-odnomu-ne-pra_ilnyy-ot_et (mp3cut.net).mp3');
var matchSound = new Audio('audio/line_open (mp3cut.net).mp3');

function init() {
    if (document.readyState == 'loading') {
        document.addEventListener('DOMContentLoaded', ready);
    }
    aiPadel = {
        direction: 1,
        SPEED: 2,
        top: 0
    }

    ball = {
        top: 340,
        left: 460,
        angle: UP_LEFT,
        speed: 9
    }

    interval = setInterval(update, 10);
}

$pong.mousemove(function(evt) {
    if (!interval) {
        return;
    }
    const top = Math.min(
        $pong.height() - $playerPadel.height(),
        evt.pageY - $pong.offset().top
    )
    $playerPadel.css({
        top: `${top}px`
    });
});

function update() {
    updateBall();
    updateAiPadel();
}

function updateBall() {
    ball.top += ball.speed * Math.sin(ball.angle);
    ball.left += ball.speed * Math.cos(ball.angle);
    $ball.css({
        top: `${ball.top}px`,
        left: `${ball.left}px`
    });

    if (isBallOverlappingWithPlayerPadel()) {
        if (ball.angle === UP_LEFT) {
            ball.angle = UP_RIGHT;
        } else {
            ball.angle = DOWN_RIGHT;
        }
    }

    if (isBallOverlappingWithAiPadel()) {
        if (ball.angle === UP_RIGHT) {
            ball.angle = UP_LEFT;
        } else {
            ball.angle = DOWN_LEFT;
        }
    }

    if (isBallOverlappingWithTop()) {
        if (ball.angle === UP_RIGHT) {
            ball.angle = DOWN_RIGHT;
        } else {
            ball.angle = DOWN_LEFT;
        }
    }

    if (isBallOverlappingWithBottom()) {
        if (ball.angle === DOWN_RIGHT) {
            ball.angle = UP_RIGHT;
        } else {
            ball.angle = UP_LEFT;
        }
    }
    if (timeourRemaining === 10) {
        victory();
    }
    if (timenotourRemaining === 10) {
        gameover();
    }
    const winner = getWinner();
    if (winner) {
        endGame(winner);
    }
}

function getWinner() {
    this.timerour = document.getElementById('our');
    this.timernotour = document.getElementById('notour');
    this.timernotour.innerText = this.timenotourRemaining;
    this.timerour.innerText = this.timeourRemaining;
    if (ball.left < 0) {
        this.timenotourRemaining++;
        return 'red';
    } else if (ball.left > $pong.width() - $ball.width()) {
        this.timeourRemaining++;
        return 'blue';
    } else {
        return false;
    }
}


function isBallOverlappingWithPlayerPadel() {
    return $ball.overlaps('#player-padel').length > 0
}

function isBallOverlappingWithAiPadel() {
    return $ball.overlaps('#ai-padel').length > 0
}

function isBallOverlappingWithTop() {
    return ball.top <= 0;
}

function isBallOverlappingWithBottom() {
    return ball.top >= $pong.height() - $ball.height();
}

function updateAiPadel() {
    if (aiPadel.top > $pong.height() - $aiPadel.height()) {
        aiPadel.direction = -1;
    }

    if (aiPadel.top < 0) {
        aiPadel.direction = 1;
    }

    aiPadel.top += aiPadel.direction * aiPadel.SPEED;

    $aiPadel.css({
        top: `${aiPadel.top}px`
    });
}

function endGame(winner) {
    this.timernotour.innerText = this.timenotourRemaining;
    this.timerour.innerText = this.timeourRemaining;
    clearInterval(interval);
    interval = null;
    interval2 = setTimeout(init, 600);

}

function victory() {
    clearInterval(interval);
    interval = null;
    matchSound.onplaying = function() {
        smoke.alert("Поздравляю!!! Ты настоящий Бруно Резенде!");
    }
    matchSound.play();
}

function gameover() {
    clearInterval(interval);
    interval = null;
    mismatchSound.onplaying = function() {
        smoke.alert("Увы! Бруно Резенде из тебя никакой.");
    }
    mismatchSound.play();
}