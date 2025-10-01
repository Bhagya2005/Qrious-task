
function task10(drinks) {
    return drinks.sort((a, b) => a.price - b.price);
}


console.log(task10([{name:"lemonade", price:50},{name:"lime", price:10}]));

