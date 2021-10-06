import {Neuron} from "./neuron.js";
import {Pulse} from "./pulse.js";

export class Structure {
    static EXPANSION_ATTEMPTS = 4;
    static SPACING = 1;
    static RADIUS_MIN = 1;
    static RADIUS_MAX = 15;
    static RADIUS_MUTATION = .3;

    constructor(width, height, random) {
        this.width = width;
        this.height = height;
        this.nodes = this.makeNodes(width, height, random);
        this.pulses = [];
    }

    fits(nodes, x, y, radius) {
        if (x < 0 || y < 0 || x > this.width || y > this.height)
            return false;

        for (let node = 0, nodeCount = nodes.length; node < nodeCount; ++node) {
            const dx = x - nodes[node].x;
            const dy = y - nodes[node].y;
            const dist = radius + nodes[node].radius;

            if (dx * dx + dy * dy < dist * dist)
                return false;
        }

        return true;
    }

    touch(x, y) {
        const neuron = this.getNearest(x, y);

        if (neuron) for (let i = 0; i < 50; ++i)
            this.pulses.push(new Pulse(neuron));
    }

    getNearest(x, y) {
        let nearest = null;
        let nearestDistance = Number.MAX_VALUE;

        for (let node = 0, nodeCount = this.nodes.length; node < nodeCount; ++node) {
            const dx = this.nodes[node].x - x;
            const dy = this.nodes[node].y - y;
            const d = dx * dx + dy * dy;

            if (d < nearestDistance) {
                nearestDistance = d;
                nearest = this.nodes[node];
            }
        }

        return nearest;
    }

    makeNodes(width, height, random) {
        const neurons = [];

        neurons.push(new Neuron(
            width * .5,
            height * .5,
            Structure.RADIUS_MIN));

        const stack = neurons.slice();
        let neuron = null;

        while (neuron = stack.shift()) {
            for (let i = 0; i < Structure.EXPANSION_ATTEMPTS; ++i) {
                const radius = Math.max(
                    Structure.RADIUS_MIN,
                    Math.min(
                        Structure.RADIUS_MAX,
                        neuron.radius * (1 + (2 * random.float - 1) * Structure.RADIUS_MUTATION)));
                const distance = radius + neuron.radius + Structure.SPACING;
                const angle = random.float * Math.PI * 2;
                const x = neuron.x + Math.cos(angle) * distance;
                const y = neuron.y + Math.sin(angle) * distance;

                if (this.fits(neurons, x, y, radius)) {
                    const child = new Neuron(x, y, radius, neuron.length + 1, neuron);

                    neurons.push(child);
                    stack.push(child);

                    neuron.addChild(child);
                }
            }
        }

        return neurons;
    }

    update(random) {
        for (let pulse = this.pulses.length; pulse-- > 0;)
            if (!this.pulses[pulse].update(random))
                this.pulses.splice(pulse, 1);
    }

    findEnds() {
        const ends = [];

        for (let node = this.nodes.length; node-- > 0;)
            if (this.nodes[node].children.length === 0)
                ends.push(this.nodes[node]);

        return ends;
    }

    drawNetwork(context) {
        context.fillStyle = "#476fbf";
        context.strokeStyle = "#93c1e2";

        const connected = [];

        for (let end of this.findEnds()) {
            context.beginPath();
            context.moveTo(
                (end.x + end.parent.x) * .5,
                (end.y + end.parent.y) * .5);

            while (end.parent) {
                if (end.parent.parent)
                    context.quadraticCurveTo(
                        end.parent.x,
                        end.parent.y,
                        (end.parent.x + end.parent.parent.x) * .5,
                        (end.parent.y + end.parent.parent.y) * .5);
                else
                    context.quadraticCurveTo(
                        (end.x + end.parent.x) * .5,
                        (end.y + end.parent.y) * .5,
                        end.parent.x,
                        end.parent.y);

                end = end.parent;

                // if (connected.indexOf(end) === -1)
                //     connected.push(end);
                // else
                //     break;
            }

            context.stroke();
        }

        // for (const node of this.nodes)
        //     node.draw(context);
    }

    draw(context) {
        context.fillStyle = "#fff";

        for (let pulse = 0, pulseCount = this.pulses.length; pulse < pulseCount; ++pulse)
            this.pulses[pulse].draw(context);
    }
}