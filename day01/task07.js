function task07(s) {
    if (!s.length) return "";
    let y = s[0];
    for (let i = 1; i < s.length; i++) {
        while (s[i].indexOf(y) !== 0) {
            y = y.slice(0, -1);
            if (!y) return "";
        }
    }
    return y;
}
console.log(task07(["bhagyapatel","bhagya","bhagyap"]));
