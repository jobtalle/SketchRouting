export class Pulse {
    constructor(neuron, random, reversed = false) {
        this.neuron = neuron;
        this.reversed = reversed;
        this.radius = Pulse.RADIUS_MIN + (Pulse.RADIUS_MAX - Pulse.RADIUS_MIN) * Math.pow(random.float, Pulse.RADIUS_POWER);
    }

    update(random) {
        if (this.reversed) {
            if (this.neuron.children.length === 0)
                return false;

            this.neuron = this.neuron.children[Math.floor(random.float * this.neuron.children.length)];

            return true;
        }
        else {
            if (this.neuron.parent === null)
                return false;

            this.neuron = this.neuron.parent;

            return true;
        }
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
        if (this.reversed)
            return;

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

Pulse.RADIUS_MIN = 16;
Pulse.RADIUS_MAX = 80;
Pulse.RADIUS_POWER = 5;