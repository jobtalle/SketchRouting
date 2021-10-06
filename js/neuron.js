export class Neuron {
    constructor(x, y, radius, length = 0, parent = null) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.parent = parent;
        this.children = [];
        this.length = length;
    }

    next(random) {
        return this.children[Math.floor(random.float * this.children.length)];
    }

    draw(context) {
        // context.beginPath();
        // context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        // context.fill();

        for (const connection of this.children) {
            context.beginPath();
            context.moveTo(this.x, this.y);
            context.lineTo(connection.x, connection.y);
            context.stroke();
        }
    }

    addChild(neuron) {
        this.children.push(neuron);
    }
}