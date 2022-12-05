'use strict'
var gSafeClickCount = 3

function getSafeClick(elSafeClickBtn) {
    // Not letting the use of safe click before firstClick happens, also when out of safe clicks
    if (gIsFirstClick) return renderSafeClickBtn(elSafeClickBtn)
    if (!gSafeClickCount) return renderSafeClickBtn(elSafeClickBtn)
    showSafeClick()
    renderSafeClickBtn()
}

// Passing default parameters incase called from onInit
function renderSafeClickBtn(elSafeClickBtn = document.querySelector('.safe-click')) {
    if (!gGame.isOn) return elSafeClickBtn = `Safe Clicks:🦺🦺🦺`

    if (gIsFirstClick) return elSafeClickBtn.innerHTML = `Don't Worry Yet! Click me after the first move!`
    if (!gSafeClickCount) return elSafeClickBtn.innerHTML = 'No more safe clicks for you 🙃'

    var strHTML = 'Safe Clicks: '
    for (var i = 0; i < gSafeClickCount; i++) {
        strHTML += '🦺'
    }
    elSafeClickBtn.innerHTML = strHTML
}

function showSafeClick() {
    var emptyCellsLocation = getEmptyCellsLocation()
    if (!emptyCellsLocation) return
    const randIdx = getRandomInt(0, emptyCellsLocation.length)
    const emptyCellLocation = emptyCellsLocation.splice(randIdx, 1)[0]
    const elEmptyCell = document.querySelector(`.cell-${emptyCellLocation.i}-${emptyCellLocation.j}`)
    elEmptyCell.classList.add('safe')
    setTimeout(() => {
        elEmptyCell.classList.remove('safe')
    }, 1000)
    gSafeClickCount--
}

