export class Pulse {
    static DECAY = 1 / 100;

    constructor(neuron) {
        this.neuron = neuron;
        this.life = 1;
    }

    update(random) {
        if (this.neuron.children.length < 1 || (this.life -= Pulse.DECAY) < 0)
            return false;

        this.neuron = this.neuron.next(random);

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