export class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, 16, 0, Math.PI * 2);
        context.stroke();
    }
}