function task9(obj) {
    let { shape, value } = obj;
    if (!shape || !value) return "Invalid input";

    switch (shape.toLowerCase()) {
        case "circle":
            if (!obj.radius) return "Radius required";
            return value === "area" ? Math.PI * obj.radius ** 2 :
                   value === "parameter" ? 2 * Math.PI * obj.radius : "Invalid value";
        case "square":
            if (!obj.side) return "Side required";
            return value === "area" ? obj.side ** 2 :
                   value === "parameter" ? 4 * obj.side : "Invalid value";
        case "rectangle":
            if (!obj.length || !obj.width) return "Length and width required";
            return value === "area" ? obj.length * obj.width :
                   value === "parameter" ? 2 * (obj.length + obj.width) : "Invalid value";
        case "triangle":
            if (!obj.base || !obj.height) return "Base and height required";
            return value === "area" ? 0.5 * obj.base * obj.height : "Invalid value";
        default:
            return "Shape not supported";
    }
}
console.log(task9({shape:"circle", value:"area", radius:10}));

