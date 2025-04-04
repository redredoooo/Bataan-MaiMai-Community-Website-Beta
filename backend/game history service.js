let gameHistory = []; // In-memory storage for game history

async function addGameHistory(players, timestamp) {
    try {
        const entry = { players, timestamp };
        gameHistory.push(entry);
        return entry; // Return the added entry
    } catch (error) {
        console.error("Error adding game history:", error);
        throw error;
    }
}

async function getGameHistory() {
    try {
        return [...gameHistory].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } catch (error) {
        console.error("Error fetching game history:", error);
        throw error;
    }
}

async function clearGameHistory() {
    try {
        const deletedCount = gameHistory.length;
        gameHistory = [];
        return deletedCount;
    } catch (error) {
        console.error("Error clearing game history:", error);
        throw error;
    }
}

module.exports = {
    addGameHistory,
    getGameHistory,
    clearGameHistory,
};
