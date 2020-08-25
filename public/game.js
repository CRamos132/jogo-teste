export default function createGame() {
            
    const state = {
        players: {},
        fruits: {},
        screen: {
            width: 10,
            height: 10
        }
    }

    const observers = []

    function subscribe(observerFunction) {
        observers.push(observerFunction)
    }

    function notifyAll(command) {
        
        console.log(`Notifying ${observers.length} observers`)

        for (const observerFunction of observers) {
            observerFunction(command)
        }
    }

    function setState(newState) {
        Object.assign(state, newState)
    }

    function addPlayer(command) {
        const playerId = command.playerId
        const playerX = 'playerX' in command ? command.playerX : Math.floor(Math.random() * state.screen.width)
        const playerY = 'playerY' in command ? command.playerY : Math.floor(Math.random() * state.screen.height)

        state.players[playerId] = {
            x: playerX,
            y: playerY
        }

        notifyAll({
            type: 'add-player',
            playerId: playerId,
            playerX: playerX,
            playerY: playerY
        })
    }

    function removePlayer(command) {
        const playerId = command.playerId

        delete state.players[playerId]

        notifyAll({
            type: 'remove-player',
            playerId: playerId,
        })
    }

    function addFruit(command) {
        const fruitId = command.fruitId
        const fruitX = command.fruitX
        const fruitY = command.fruitY

        state.fruits[fruitId] = {
            x: fruitX,
            y: fruitY
        }
    }

    function removeFruit(command) {
        const fruitId = command.fruitId

        delete state.fruits[fruitId]
    }

    function movePlayer(command){
        console.log(`moving ${command.playerId} with ${command.keyPressed}`)
        notifyAll(command)

        const acceptedMoves = {
            ArrowUp(player) {
                
                if (player.y - 1 >= 0){
                    player.y--
                }
            },
            ArrowDown(player) {
                if (player.y + 1 < state.screen.height){
                    player.y++
                }
            },
            ArrowLeft(player) {
                if (player.x - 1 >= 0) {
                    player.x--
                }
            },
            ArrowRight(player) {
                if (player.x + 1 < state.screen.width) {
                    player.x++
                }
            },
        }
        const keyPressed = command.keyPressed
        const playerId = command.playerId
        const player = state.players[command.playerId]
        const moveFunction = acceptedMoves[keyPressed]
        if (player && moveFunction) {
            
            moveFunction(player)
            checkForFruitCollision(playerId)
        }
    }

    function checkForFruitCollision(playerId) {
        
        const player = state.players[playerId]
        for ( const fruitId in state.fruits ) {
            const fruit = state.fruits[fruitId]

            if (player.x === fruit.x && player.y === fruit.y) {
                console.log('bateu')
                removeFruit({fruitId: fruitId})
            }
        }
    }

    return {
        movePlayer,
        state,
        addPlayer,
        removePlayer,
        addFruit,
        removeFruit,
        setState,
        subscribe
    }
}