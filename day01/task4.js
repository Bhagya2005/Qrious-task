function task04(flowerbed, n) {
    for (let i = 0; i < flowerbed.length; i++) {
        if (flowerbed[i] === 0 &&
            (i === 0 || flowerbed[i - 1] === 0) &&
            (i === flowerbed.length - 1 || flowerbed[i + 1] === 0)) {
            flowerbed[i] = 1;
            n--;
        }
    }
    return n <= 0;
}

console.log("answer:",task04([1, 0, 0, 0, 1], 1));