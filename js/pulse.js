export class Pulse {
    constructor(neuron) {
        this.neuron = neuron;
    }

    update(random) {
        if (this.neuron.parent === null)
            return false;

        this.neuron = this.neuron.parent;
        this.radius = 24;

        return true;
    }

    draw(context) {
        const gradient = context.createRadialGradient(
            this.neuron.x,
            this.neuron.y,
            0,
            this.neuron.x,
            this.neuron.y,
            this.radius);

        gradient.addColorStop(0, "#eed680");
        gradient.addColorStop(1, "rgba(255,255,255,0)");

        context.fillStyle = gradient;

        context.beginPath();
        context.arc(
            this.neuron.x,
            this.neuron.y,
            this.radius,
            0,
            Math.PI * 2);
        context.fill();
    }

    drawLight(context) {
        const radius = this.radius * 2 / (1 + this.neuron.length * .1);
        const gradient = context.createRadialGradient(
            this.neuron.x,
            this.neuron.y,
            0,
            this.neuron.x,
            this.neuron.y,
            radius);

        gradient.addColorStop(0, "rgba(248,247,227,0.58)");
        gradient.addColorStop(1, "rgba(255,255,255,0)");

        context.fillStyle = gradient;

        context.beginPath();
        context.arc(
            this.neuron.x,
            this.neuron.y,
            radius,
            0,
            Math.PI * 2);
        context.fill();
    }
}