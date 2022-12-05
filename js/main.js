'use strict'
const MINE = '💣'
const FLAG = '🚩'
const LIFE = '❤️'

var gBoard
var gMinesLocation
var gIsFirstClick
var gTimerIntervalId
var gPlayerLivesCount

var gIsUserMines
var gUserMinesLocation
var gIsRandomMines

var gPrevGameState
var gPrevMoveCells

var gIsMineExterminatorOn
const gElTimerContainer = document.querySelector('.timer')
const elScoreContainer = document.querySelector('.score')

var gLevel = {
    SIZE: 4,
    MINES: 2,
    LIVES: 1,
    LEVEL: 'Easy',
    flagsCount: 2
}

var gGame = {
    isOn: false,
    cellShownCount: 0,
    flagMarkedCount: 0
}

function onInit() {
    if (gTimerIntervalId) clearInterval(gTimerIntervalId)
    gBoard = createBoard()
    renderBoard(gBoard)
    renderScore()
    renderScoreRanking()
    gIsFirstClick = true

    gPlayerLivesCount = gLevel.LIVES
    renderLivesContainer()

    gHint = {
        isHintOn: false,
        hintsCount: 3
    }
    renderHint()

    gSafeClickCount = 3
    renderSafeClickBtn()

    gMegaHintCount = 1
    gIsMegaHintOn = false
    gMegaHintCellsIdx = []
    renderMegaHintBtn()

    gIsRandomMines = true
    gIsUserMines = false
    renderUserMinesBtn()
    gUserMinesLocation = []

    gIsSevenBoom = false
    renderSevenBoomBtn()

    gIsMineExterminatorOn = false

    gPrevGameState = []
    gPrevMoveCells = []
    gGame.isOn = true
}

function createBoard() {
    const board = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {

            const cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                location: { i, j },

            }
            board[i][j] = cell
        }
    }
    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr>`
        for (var j = 0; j < board[0].length; j++) {
            var className = ` cell-${i}-${j}`
            const title = `Cell: ${i}, ${j}`

            strHTML += `\t<td style="width:calc(100% / ${gLevel.SIZE});height:calc(100%/${gLevel.SIZE})" class="cell ${className}" title="${title}" 
                            onmousedown="cellClicked(this, ${i}, ${j}, event)" >
                         </td>\n`
        }

        strHTML += `</tr>\n`
    }
    const elBoard = document.querySelector('.game-table')
    elBoard.innerHTML = strHTML
}

function getMinesLocation() {
    const minesLocation = []
    const emptyCells = getEmptyCellsLocation()
    for (var i = 0; i < gLevel.MINES; i++) {
        const randIdx = getRandomInt(0, emptyCells.length)
        const mineLocation = emptyCells.splice(randIdx, 1)[0]
        minesLocation.push(mineLocation)
    }
    return minesLocation
}

function setMines() {
    for (var i = 0; i < gMinesLocation.length; i++) {
        const currMineLocation = gMinesLocation[i]
        gBoard[currMineLocation.i][currMineLocation.j].isMine = true
        gBoard[currMineLocation.i][currMineLocation.j].minesAroundCount = MINE
    }
}

function setMinesNegsCount() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            const currCell = gBoard[i][j]
            // If currCell is a mine dont change minesAroundCount value
            if (currCell.isMine) continue
            currCell.minesAroundCount = countNegsCount(currCell.location)
        }
    }
}

function countNegsCount(location) {
    var neighborsCount = 0
    for (var i = location.i - 1; i <= location.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue

        for (var j = location.j - 1; j <= location.j + 1; j++) {
            if (i === location.i && j === location.j) continue
            if (j < 0 || j >= gBoard[i].length) continue

            if (gBoard[i][j].isMine) neighborsCount++
        }
    }
    return neighborsCount
}

function cellClicked(elCell, i, j, ev) {
    if (!gGame.isOn) return
    const cell = gBoard[i][j]

    if (gIsMegaHintOn) {
        gMegaHintCellsIdx.push({ i, j })
        if (gMegaHintCellsIdx.length === 2) showMegaHint()
        return
    }

    // Not letting the user click if mine exterminator is on - if he clicks on nearby cell it won't be shown bcs of hideDeletedMines
    if (gIsMineExterminatorOn) return

    // Checking if user is setting mines if so pushing it to array with location obj
    if (gIsUserMines) return gUserMinesLocation.push({ i, j })
    // Checking if user right clicked
    if (ev.which === 3) return cellMarked(elCell, cell)
    // Checking if the clicked cell is clicked or flagged already
    if (cell.isShown || cell.isMarked) return
    // Checking if user is using hint - only after passing prev checks
    if (gHint.isHintOn) return showHint(cell)

    // Pushing the clickedCell pointer and clickedCell element into prevMoveCells arr. in order reverse the game state when undo is clicked
    gPrevMoveCells = []
    gPrevMoveCells.push({ cell, elCell })

    // Checking if it's user's first click, if so calling onFirstClick and setting the g variable to false
    if (gIsFirstClick) {
        onFirstClick(elCell, cell)
        gIsFirstClick = false
        return
    }

    // Checking if user clicked on a mine
    if (cell.isMine) {
        gPlayerLivesCount--
        renderLivesContainer()
    }
    // If passed all prev checks, updating model and dom, so as calling expandShown if has no negs
    // MODEL
    cell.isShown = true
    gGame.cellShownCount++
    // DOM
    elCell.innerHTML = cell.minesAroundCount
    elCell.classList.add('shown')
    renderScore()

    checkGameOver()
    if (!cell.minesAroundCount) expandShown(cell)
    // prevMoveCells is pushed to gPrevGameState only after expandShown is called
    gPrevGameState.push(gPrevMoveCells)
}

function cellMarked(elCell, cell) {

    if (!cell.isMarked && gLevel.flagsCount) {
        // MODEL
        cell.isMarked = true
        gGame.flagMarkedCount++
        gLevel.flagsCount--
        // DOM
        elCell.innerHTML = FLAG
        renderScore()
        checkGameOver()

    } else if (cell.isMarked) {
        // MODEL
        cell.isMarked = false
        gGame.flagMarkedCount--
        gLevel.flagsCount++
        // DOM
        elCell.innerHTML = ''
        renderScore()
    }
}


function onFirstClick(elCell, cell) {
    startTimer()
    // MODEL
    cell.isShown = true
    gGame.cellShownCount++
    // checking if user picked 7 boom mines, if he didn't - 
    // Checking if user used manual mines func, adding mines and setting negsCount accordingly
    if (!gIsSevenBoom) {
        gMinesLocation = (gIsRandomMines) ? getMinesLocation() : gUserMinesLocation
    } else {
        gMinesLocation = setSevenBoomMines()
    }
    console.log('gMinesLocation:', gMinesLocation)
    setMines()
    setMinesNegsCount()
    // DOM
    elCell.classList.add('shown')
    elCell.innerHTML = cell.minesAroundCount
    renderScore()
    // Calling expandShown func if currCell has no negs
    if (!cell.minesAroundCount) expandShown(cell)

    // prevMoveCells contains the clicked cell from cellClicked func
    // prevMoveCells is pushed to gPrevGameState only after expandShown is called - in case the clicked cell has no negs
    gPrevGameState.push(gPrevMoveCells)
}

function checkGameOver() {
    // Setting isVictory var in order make the func more readable - will be sent as boolean to gameOver 
    var isVictory
    // Lose Condition - no more lives
    if (!gPlayerLivesCount) {
        isVictory = false
        return gameOver(isVictory)
    }
    // Win Condition - cells shown and marked are equal to mat cells count
    if (gGame.cellShownCount + gGame.flagMarkedCount === gLevel.SIZE ** 2) {
        isVictory = true
        return gameOver(isVictory)
    }
}

function gameOver(isVictory) {
    const elSmileyContainer = document.querySelector('.smiley')
    if (isVictory) elSmileyContainer.innerHTML = '🌝'
    if (!isVictory) elSmileyContainer.innerHTML = '😞'
    gGame.isOn = false
    clearInterval(gTimerIntervalId)
    checkPlayerRank()
    renderScoreRanking()
}

// Setting default parameters if restartGame is called by clicking the smiley and not by changing game difficulity
function restartGame(size = gLevel.SIZE, minesCount = gLevel.MINES, livesCount = gLevel.LIVES, level = gLevel.LEVEL) {
    const elSmileyContainer = document.querySelector('.smiley')
    elSmileyContainer.innerHTML = '🤨'
    // Initializing gLevel and gGame by default parameters / sent arguments from changing game difficulity
    gLevel = {
        SIZE: size,
        MINES: minesCount,
        LIVES: livesCount,
        LEVEL: level,
        flagsCount: minesCount
    }

    gGame = {
        isOn: false,
        cellShownCount: 0,
        flagMarkedCount: 0
    }
    onInit()
}

// OPTION A: using expandShown recursion
function expandShown(cell) {

    for (var i = cell.location.i - 1; i <= cell.location.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue

        for (var j = cell.location.j - 1; j <= cell.location.j + 1; j++) {
            if (i === cell.location.i && j === cell.location.j) continue
            if (j < 0 || j >= gBoard[i].length) continue

            const currCell = gBoard[i][j]
            if (currCell.isShown || currCell.isMarked) continue
            const elCell = document.querySelector(`.cell-${i}-${j}`)
            // Pushing the cell pointer and element that are shown by expandShown in order to reverse the whole move and not just one cell  
            gPrevMoveCells.push({ cell: currCell, elCell })

            // MODEL
            currCell.isShown = true
            gGame.cellShownCount++
            // DOM
            elCell.innerHTML = currCell.minesAroundCount
            elCell.classList.add('shown')
            renderScore()
            if (!currCell.minesAroundCount) expandShown(currCell)
        }
    }
    // Avoiding multiple checkGameOver calls
    if (gGame.isOn) checkGameOver()
}
// Option B: Using cellClicked recursion
// function expandShown(cell) {
//     for (var i = cell.location.i - 1; i <= cell.location.i + 1; i++) {
//         if (i < 0 || i >= gBoard.length) continue

//         for (var j = cell.location.j - 1; j <= cell.location.j + 1; j++) {
//             if (i === cell.location.i && j === cell.location.j) continue
//             if (j < 0 || j >= gBoard[i].length) continue

//             const currCell = gBoard[i][j]
//             if (currCell.isShown || currCell.isMarked) continue
//             const elCell = document.querySelector(`.cell-${i}-${j}`)
//             cellClicked(elCell, i, j, { which: 1 })
//         }
//     }
// }


function renderScore() {
    elScoreContainer.innerHTML = `Score: ${gGame.cellShownCount + gGame.flagMarkedCount}`
}

function setUserMines(elUserMinesBtn) {
    // Checking if user already started playing, return if so
    if (!gIsFirstClick) return renderUserMinesBtn(elUserMinesBtn)
    // Using gIsRandomMines to make sure mines are created manually (check onFirstClick short if)
    gIsRandomMines = false
    // Using gIsUserMines to check when user finished setting mines - when back to false game starts
    gIsUserMines = !gIsUserMines
    // Rendering user mine btn text to guide him how to use it
    renderUserMinesBtn(elUserMinesBtn)
}

function renderUserMinesBtn(elUserMinesBtn = document.querySelector('.user-mines')) {
    if (!gGame.isOn) elUserMinesBtn.innerHTML = 'Choose Your Own Mines!'
    if (!gIsFirstClick) return elUserMinesBtn.innerHTML = 'Can not set mines after game starts 🤨'
    if (gIsUserMines) elUserMinesBtn.innerHTML = 'Go pick as many as you want! Click me when finished'
    if (!gIsUserMines && !gIsRandomMines) elUserMinesBtn.innerHTML = 'Start Playing!'
}

function renderLivesContainer() {
    const elLivesCount = document.querySelector('.lives-count')
    elLivesCount.innerHTML = ''
    for (var i = 0; i < gPlayerLivesCount; i++) {
        elLivesCount.innerHTML += LIFE
    }
}

function undoMove() {
    if (!gGame.isOn || gIsFirstClick) return
    // Getting the lastMove cells content and removing it from gPrevGameState
    const lastMoveCells = gPrevGameState.splice(gPrevGameState.length - 1, 1)[0]
    // For looping in case lastMove has more than one cell
    for (var i = 0; i < lastMoveCells.length; i++) {
        const currCell = lastMoveCells[i]
        // MODEL
        // Updating lives count if last move was clicking a mine
        if (currCell.cell.isMine) {
            gPlayerLivesCount++
            renderLivesContainer()
        }
        currCell.cell.isShown = false
        gGame.cellShownCount--
        renderScore()
        // DOM
        currCell.elCell.innerHTML = ''
        currCell.elCell.classList.remove('shown')
    }
}

function onMineExterminator(elBtn) {
    if (!gGame.isOn) return
    if (gIsFirstClick) return elBtn.innerHTML = `Don't Worry Yet! Click me after the first move!`
    if (!gMinesLocation.length) return elBtn.innerHTML = `No more mines🤨`
    // Checking if there is less than 3 mines
    gIsMineExterminatorOn = true
    var deletedMinesCount = (gMinesLocation.length < 3) ? gMinesLocation.length : 3
    const deletedMines = []
    for (var i = 0; i < deletedMinesCount; i++) {
        // Removing the mine from gMinesLocation arr
        const currMineLocation = gMinesLocation.splice(0, 1)[0]
        const currMine = gBoard[currMineLocation.i][currMineLocation.j]
        // Model
        currMine.isMine = false
        // Dom
        const elCurrMine = document.querySelector(`.cell-${currMineLocation.i}-${currMineLocation.j}`)
        elCurrMine.classList.add('shown')
        elCurrMine.innerHTML = currMine.minesAroundCount
        deletedMines.push(elCurrMine)
    }
    // Hiding the mines after 2 sec
    setTimeout(hideDeletedMines, 2000, deletedMines)
    // Setting the new cells negs value  
    setMinesNegsCount()
}

function hideDeletedMines(deletedMines) {
    for (var i = 0; i < deletedMines.length; i++) {
        const currDeletedMine = deletedMines[i]
        currDeletedMine.classList.remove('shown')
        currDeletedMine.innerHTML = ''
    }
    gIsMineExterminatorOn = false
}