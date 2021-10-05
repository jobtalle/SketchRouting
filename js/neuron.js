export class Neuron {
    static DEFAULT_WEIGHT = 1;
    static DEFAULT_DECAY = .01;

    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.connections = [];
        this.weights = [];
        this.totalWeight = 0;
    }

    calculateTotalWeight() {
        this.totalWeight = 0;

        for (let connection = 0, connections = this.connections.length; connection < connections; ++connection)
            this.totalWeight += this.weights[connection];
    }

    decay() {
        for (let weight = 0, weightCount = this.weights.length; weight < weightCount; ++weight) {
            const d = this.weights[weight] - Neuron.DEFAULT_WEIGHT;

            this.weights[weight] += d * Neuron.DEFAULT_DECAY;
        }
    }

    next(random) {
        const connectionCount = this.connections.length;
        let index = 0;

        if (connectionCount > 1) {
            const at = random.float * this.totalWeight;
            let w = this.weights[0];

            index = connectionCount - 1;

            for (let connection = 1, connections = this.connections.length; connection < connections; ++connection) {
                if (at < w) {
                    index = connection - 1;

                    break;
                }

                w += this.weights[connection];
            }
        }

        this.decay();
        this.calculateTotalWeight();

        return index;
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

    connect(neuron, random) {
        if (this.connections.indexOf(neuron) === -1) {
            this.connections.push(neuron);
            this.weights.push(1 + random.float * 4);

            this.calculateTotalWeight();
        }
    }
}