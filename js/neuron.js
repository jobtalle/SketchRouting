export class Neuron {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.connections = [];
    }

    draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();

        for (const connection of this.connections) {
            context.beginPath();
            context.moveTo(this.x, this.y);
            context.lineTo(connection.x, connection.y);
            context.stroke();
        }
    }

    connect(neuron) {
        if (this.connections.indexOf(neuron) === -1)
            this.connections.push(neuron);
    }
}