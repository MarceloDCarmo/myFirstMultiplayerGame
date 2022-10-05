export default function createKeyboardListener(document) {
    const state = {
        observers: [],
        playerId: null
    }

    function subscribe(observerFunction) {
        state.observers.push(observerFunction)
    }

    function notifyAll(command) {
        console.log(`Notifying ${state.observers.length} observers`)
        for (const observerFunction of state.observers) {
            observerFunction(command)
        }
    }

    function unsubscribeAll() {
        state.observers.length = 0
    }

    function registerPlayerId(playerId) {
        state.playerId = playerId
    }

    document.addEventListener('keydown', handleKeydown)

    function handleKeydown(event) {
        const keyPressed = event.key

        const command = {
            type: 'move-player',
            playerId: state.playerId,
            keyPressed
        }

        notifyAll(command)
    }

    return {
        subscribe,
        unsubscribeAll,
        registerPlayerId
    }
}
