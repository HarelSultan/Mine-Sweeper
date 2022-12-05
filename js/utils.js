'use strict'
function getEmptyCellsLocation() {
    const emptyCellsLocation = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            const currCell = gBoard[i][j]
            if (!currCell.isShown && !currCell.isMine && !currCell.isMarked) emptyCellsLocation.push({ i, j })
        }
    }
    if (!emptyCellsLocation.length) return null
    return emptyCellsLocation
}

// Maximum Exclusive
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min)
}

function startTimer() {
    var startTime = Date.now()
    gTimerIntervalId = setInterval(() => {
        var timePassed = Date.now() - startTime + 0
        var milliseconds = parseInt((timePassed % 1000) / 1)
        var seconds = parseInt((timePassed / 1000) % 60)
        var minutes = parseInt((timePassed / (1000 * 60)) % 60)
        seconds = (seconds <= 9) ? ('0' + seconds) : seconds
        minutes = (minutes <= 9) ? ('0' + minutes) : minutes
        gElTimerContainer.innerText = `${minutes}:${seconds}:${milliseconds}`
    }, 10)
}


// To fixed, and gElTimer