export const formatTime = (elapsed: number) => {
    
    function pad(n: number) {
        return n.toString().padStart(2, '0')
    }

    const hours = Math.floor(elapsed / 1000 / 60 / 60)
    const minutes = Math.floor((elapsed/ 1000 / 60) % 60)
    const seconds = Math.floor((elapsed / 1000) % 60)

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

};