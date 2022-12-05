'use strict'

var gMegaHintCount
var gIsMegaHintOn
var gMegaHintCellsIdx


function onMegaHint(elBtn) {
    if (gIsFirstClick) return renderMegaHintBtn(elBtn)
    if (!gMegaHintCount) return renderMegaHintBtn(elBtn)
    gIsMegaHintOn = true
    renderMegaHintBtn(elBtn)
}

function showMegaHint() {
    const startIdx = gMegaHintCellsIdx[0]
    const endIdx = gMegaHintCellsIdx[1]
    const megaHintCells = []
    for (var i = startIdx.i; i <= endIdx.i; i++) {
        for (var j = startIdx.j; j <= endIdx.j; j++) {
            const currCell = gBoard[i][j]
            if (currCell.isShown || currCell.isMarked) continue
            // MODEL
            currCell.isShown = true
            // DOM
            const elCurrCell = document.querySelector(`.cell-${i}-${j}`)
            elCurrCell.innerHTML = currCell.minesAroundCount
            elCurrCell.classList.add('shown')
            megaHintCells.push({ elCell: elCurrCell, i, j })
        }
    }
    gIsMegaHintOn = false
    gMegaHintCount--
    setTimeout(hideMegaHint, 2000, megaHintCells)
}

function hideMegaHint(megaHintCells) {
    for (var i = 0; i < megaHintCells.length; i++) {
        const currCell = megaHintCells[i]
        // MODEL
        gBoard[currCell.i][currCell.j].isShown = false
        const elCurrCell = currCell.elCell
        // DOM
        elCurrCell.innerHTML = ''
        elCurrCell.classList.remove('shown')
    }
}

function renderMegaHintBtn(elBtn = document.querySelector('.mega-hint')) {
    if (!gGame.isOn) return elBtn.innerHTML = `Mega Hint!`
    if (gIsFirstClick) return elBtn.innerHTML = `Don't worry yet! Click me after the first move!`
    if (!gMegaHintCount) return elBtn.innerHTML = `No more mega hints for you🙃`
    if (gIsMegaHintOn) return elBtn.innerHTML = `Click on 2 cells, i'll reveal them and every cell between them!`

}