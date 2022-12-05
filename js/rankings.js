'use strict'
// Should make it look better
function getBestPlayer(gameLevel) {
    var bestPlayer = window.localStorage.getItem(`${gameLevel}BestPlayer`)
    if (!bestPlayer) return {
        name: null,
        score: null
    }
    bestPlayer = bestPlayer.split(',')
    var bestPlayerName = bestPlayer[0]
    var bestPlayerScore = bestPlayer[1]
    return { name: bestPlayerName, score: +bestPlayerScore }
}

function getSecondBestPlayer(gameLevel) {
    var secondBestPlayer = window.localStorage.getItem(`${gameLevel}SecondBestPlayer`)
    if (!secondBestPlayer) return {
        name: null,
        score: null
    }
    secondBestPlayer = secondBestPlayer.split(',')
    var secondBestPlayerName = secondBestPlayer[0]
    var secondBestPlayerScore = secondBestPlayer[1]
    return { name: secondBestPlayerName, score: secondBestPlayerScore }
}

function getThirdBestPlayer(gameLevel) {
    var thirdBestPlayer = window.localStorage.getItem(`${gameLevel}ThirdBestPlayer`)
    if (!thirdBestPlayer) return {
        name: null,
        score: null
    }
    thirdBestPlayer = thirdBestPlayer.split(',')
    var thirdBestPlayerName = thirdBestPlayer[0]
    var thirdBestPlayerScore = thirdBestPlayer[1]
    return { name: thirdBestPlayerName, score: thirdBestPlayerScore }
}

function checkPlayerRank() {
    var currGameLevel = gLevel.LEVEL
    var userScore = gGame.cellShownCount + gGame.flagMarkedCount
    var userName = prompt('Enter your name!')

    var bestPlayer = getBestPlayer(currGameLevel)
    if (!bestPlayer) {
        window.localStorage.setItem(`${currGameLevel}BestPlayer`, `${userName},${userScore}`)
        return
    } else if (userScore > bestPlayer.score) {
        window.localStorage.setItem(`${currGameLevel}BestPlayer`, `${userName},${userScore}`)
        userName = bestPlayer.name
        userScore = bestPlayer.score
    }

    var secondBestPlayer = getSecondBestPlayer(currGameLevel)
    if (!secondBestPlayer) {
        window.localStorage.setItem(`${currGameLevel}SecondBestPlayer`, `${userName},${userScore}`)
        return
    } else if (userScore > secondBestPlayer.score) {
        window.localStorage.setItem(`${currGameLevel}SecondBestPlayer`, `${userName},${userScore}`)
        userName = secondBestPlayer.name
        userScore = secondBestPlayer.score
    }

    var thirdBestPlayer = getThirdBestPlayer(currGameLevel)
    if (!thirdBestPlayer) {
        window.localStorage.setItem(`${currGameLevel}ThirdBestPlayer`, `${userName},${userScore}`)
        return
    } else if (userScore > thirdBestPlayer.score) {
        window.localStorage.setItem(`${currGameLevel}ThirdBestPlayer`, `${userName},${userScore}`)
    }
}

function renderScoreRanking() {
    const currGameLevel = gLevel.LEVEL

    const bestPlayer = getBestPlayer(currGameLevel)
    const secondBestPlayer = getSecondBestPlayer(currGameLevel)
    const thirdBestPlayer = getThirdBestPlayer(currGameLevel)

    const elBestPlayerName = document.querySelector('.best-player-name')
    const elBestPlayerScore = document.querySelector('.best-player-score')

    const elSecondBestPlayerName = document.querySelector('.second-best-player-name')
    const elSecondBestPlayerScore = document.querySelector('.second-best-player-score')

    const elThirdBestPlayerName = document.querySelector('.third-best-player-name')
    const elThirdBestPlayerScore = document.querySelector('.third-best-player-score')

    elBestPlayerName.innerText = bestPlayer.name
    elBestPlayerScore.innerText = bestPlayer.score

    elSecondBestPlayerName.innerText = secondBestPlayer.name
    elSecondBestPlayerScore.innerText = secondBestPlayer.score

    elThirdBestPlayerName.innerText = thirdBestPlayer.name
    elThirdBestPlayerScore.innerText = thirdBestPlayer.score
}