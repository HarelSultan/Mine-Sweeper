'use strict'
var gIsSevenBoom

function onSevenBoom(elBtn) {
    if (!gIsFirstClick) return renderSevenBoomBtn(elBtn)
    gIsSevenBoom = true
    renderSevenBoomBtn(elBtn)
}

function setSevenBoomMines() {
    var cellIndex = 0
    const minesIndex = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (i === 0 && j === 0) {
                cellIndex++
                continue
            }
            if (cellIndex % 7 === 0 || cellIndex % 10 === 7) minesIndex.push({ i, j })
            cellIndex++
        }
    }
    console.log('minesIndex:', minesIndex)
    return minesIndex
}

function renderSevenBoomBtn(elBtn = document.querySelector('.seven-boom')) {
    if (!gIsFirstClick) return elBtn.innerHTML = `Can not set 7 Boom mines after game starts 🤨`
    if (gIsSevenBoom) return elBtn.innerHTML = `It's On!`
    elBtn.innerHTML = `7 Boom!`
}