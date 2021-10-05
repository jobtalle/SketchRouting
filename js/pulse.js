export class Pulse {
    static DECAY = 1 / 100;

    constructor(neuron) {
        this.neuron = neuron;
        this.life = 1;
        this.history = [];
    }

    update(random) {
        if (this.neuron.connections.length < 1)
            return false;

        if ((this.life -= Pulse.DECAY) < 0) {
            const uniqueNeurons = [];

            for (const point of this.history)
                if (uniqueNeurons.indexOf(point.neuron) === -1)
                    uniqueNeurons.push(point.neuron);

            for (const point of this.history) {
                point.neuron.weights[point.connection] += uniqueNeurons.length * .1;
                point.neuron.calculateTotalWeight();
            }

            return false;
        }

        const nextIndex = this.neuron.next(random);

        this.history.push({
            neuron: this.neuron,
            connection: nextIndex
        });

        this.neuron = this.neuron.connections[nextIndex];

        return true;
    }

    draw(context) {
        context.beginPath();
        context.arc(
            this.neuron.x,
            this.neuron.y,
            16 * this.life,
            0,
            Math.PI * 2);
        context.fill();
    }
}