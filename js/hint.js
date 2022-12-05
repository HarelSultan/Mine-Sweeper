'use strict'

var gHint

function getHint(elHintBtn) {
    if (gIsFirstClick) return renderHint(elHintBtn)
    if (!gHint.hintsCount) return renderHint(elHintBtn)
    gHint.isHintOn = !gHint.isHintOn
    renderHint(elHintBtn)
}

function renderHint(elHintBtn = document.querySelector('.hint')) {
    if (!gGame.isOn) return elHintBtn.innerHTML = `Hints: 💡💡💡`
    if (gIsFirstClick) return elHintBtn.innerHTML = `Don't Worry Yet! Click me after the first move!`
    if (!gHint.hintsCount) return elHintBtn.innerHTML = 'No more hints for you 🙃'
    if (gHint.isHintOn) return elHintBtn.innerHTML = 'Hint On! Click again to disable me 😞'

    var hintStrHTML = 'Hints: '
    for (var i = 0; i < gHint.hintsCount; i++) {
        hintStrHTML += '💡'
    }
    elHintBtn.innerHTML = hintStrHTML
}

// showHint is called at cellClicked func
function showHint(cell) {
    var hintCells = []
    for (var i = cell.location.i - 1; i <= cell.location.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cell.location.j - 1; j <= cell.location.j + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            const currCell = gBoard[i][j]
            // Checking if one of the negs is shown/flagged to keep them reaveled after hint is off
            if (currCell.isShown || currCell.isMarked) continue
            // Model
            currCell.isShown = true
            // DOM
            const elCurrCell = document.querySelector(`.cell-${i}-${j}`)
            elCurrCell.innerHTML = currCell.minesAroundCount
            elCurrCell.classList.add('shown')
            // Keeping the cells in array to hide them after 1 sec
            hintCells.push({ elCell: elCurrCell, i, j })
        }
    }
    gHint.isHintOn = false
    gHint.hintsCount--
    renderHint()
    setTimeout(hideHint, 1000, hintCells)
}

function hideHint(hintCells) {
    for (var i = 0; i < hintCells.length; i++) {
        const currCell = hintCells[i]
        // MODEL
        gBoard[currCell.i][currCell.j].isShown = false
        const elCurrCell = hintCells[i].elCell
        // DOM
        elCurrCell.innerHTML = ''
        elCurrCell.classList.remove('shown')
    }
}
