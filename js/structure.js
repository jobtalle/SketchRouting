import {Neuron} from "./neuron.js";

export class Structure {
    static EXPANSION_ATTEMPTS = 4;
    static SPACING = 1;
    static CONNECTION_SPACING = 2;
    static RADIUS_MIN = 2;
    static RADIUS_MAX = 20;
    static RADIUS_MUTATION = 3;

    constructor(width, height, random) {
        this.width = width;
        this.height = height;
        this.nodes = this.makeNodes(width, height, random);
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

    makeNodes(width, height, random) {
        const neurons = [new Neuron(
            width * .5,
            height * .5,
            Structure.RADIUS_MIN + (Structure.RADIUS_MAX - Structure.RADIUS_MIN) * random.float)];
        const stack = neurons.slice();
        let neuron = null;

        while (neuron = stack.shift()) {
            for (let i = 0; i < Structure.EXPANSION_ATTEMPTS; ++i) {
                const radius = Math.max(
                    Structure.RADIUS_MIN,
                    Math.min(
                        Structure.RADIUS_MAX,
                        neuron.radius + (2 * random.float - 1) * Structure.RADIUS_MUTATION));
                const distance = radius + neuron.radius + Structure.SPACING;
                const angle = random.float * Math.PI * 2;
                const x = neuron.x + Math.cos(angle) * distance;
                const y = neuron.y + Math.sin(angle) * distance;

                if (this.fits(neurons, x, y, radius)) {
                    const child = new Neuron(x, y, radius);
                    neurons.push(child);
                    stack.push(child);
                }
            }
        }

        for (let first = neurons.length; first-- > 0;) {
            for (let second = first - 1; second-- > 0;) {
                const dx = neurons[first].x - neurons[second].x;
                const dy = neurons[first].y - neurons[second].y;
                const distance = neurons[first].radius + neurons[second].radius + Structure.CONNECTION_SPACING;

                if (dx * dx + dy * dy < distance * distance) {
                    neurons[first].connect(neurons[second]);
                    neurons[second].connect(neurons[first]);
                }
            }
        }

        return neurons;
    }

    draw(context) {
        context.fillStyle = "#b0d4e3";
        context.strokeStyle = "white";

        for (const node of this.nodes)
            node.draw(context);
    }
}