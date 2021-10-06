import {Neuron} from "./neuron.js";
import {Pulse} from "./pulse.js";

export class Structure {
    static EXPANSION_ATTEMPTS = 4;
    static SPACING = 1;
    static RADIUS_MIN = 2;
    static RADIUS_MAX = 32;
    static RADIUS_MUTATION = .3;
    static CENTER_RADIUS = 64;
    static TARGETS = 14;
    static PULSE_LENGTH_BIAS = .2;
    static CHARGE_DECAY = .99;
    static PULSE_THRESHOLD = 5;
    static DISCHARGE = 60;
    static DISCHARGE_CHANCE = .2;
    static PULSE_TIME_MIN = 5;
    static PULSE_TIME_MAX = 64;

    constructor(width, height, x, y, random) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.starts = [];
        this.ends = [];
        this.nodes = this.makeNodes(width, height, random);
        this.pulses = [];
        this.pulseTime = 1;
        this.pulseTimePrevious = 1;
        this.charge = 0;
        this.discharge = 0;

        window.addEventListener("keydown", event => {
            if (event.key === "x")
                this.centerPulse();
        });
    }

    get zoom() {
        return this.discharge / Structure.DISCHARGE;
    }

    fits(nodes, x, y, radius) {
        if (x < 0 || y < 0 || x > this.width || y > this.height)
            return false;

        const cdx = x - this.x;
        const cdy = y - this.y;

        if (cdx * cdx + cdy * cdy < Structure.CENTER_RADIUS * Structure.CENTER_RADIUS)
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

    centerPulse() {
        this.discharge = Structure.DISCHARGE;
    }

    touch(x, y, random) {
        const neuron = this.getNearest(x, y);

        if (neuron)
            this.pulses.push(new Pulse(neuron, random));
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
        const angleOffset = random.float;

        for (let i = 0; i < Structure.TARGETS; ++i) {
            const angle = Math.PI * 2 * (i + angleOffset) / Structure.TARGETS;

            this.starts.push(new Neuron(
                this.x + Math.cos(angle) * Structure.CENTER_RADIUS,
                this.y + Math.sin(angle) * Structure.CENTER_RADIUS,
                Structure.RADIUS_MIN));
        }

        const neurons = this.starts.slice();
        const stack = this.starts.slice();
        let neuron = null;

        while (neuron = stack.shift()) {
            let children = 0;

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

                    ++children;
                }
            }

            if (children === 0)
                this.ends.push(neuron);
        }

        return neurons;
    }

    update(random) {
        if (this.discharge !== 0) {
            this.charge = 0;

            for (const start of this.starts) if (random.float < Structure.DISCHARGE_CHANCE) {
                this.pulses.push(new Pulse(start, random, true));

                --this.discharge;
            }

            if (this.discharge < 0)
                this.discharge = 0;
        }

        this.charge *= Structure.CHARGE_DECAY;

        if (--this.pulseTime < 0) {
            this.pulses.push(new Pulse(this.ends[
                Math.floor(Math.pow(random.float, Structure.PULSE_LENGTH_BIAS) * this.ends.length)], random));

            const r = .4;
            const time = Math.max(
                Structure.PULSE_TIME_MIN,
                Math.min(
                    Structure.PULSE_TIME_MAX,
                    this.pulseTimePrevious * (1 + (random.float * 2 - 1) * r)));

            this.pulseTimePrevious = time;

            this.pulseTime = time;
        }

        for (let pulse = this.pulses.length; pulse-- > 0;) if (!this.pulses[pulse].update(random)) {
            if (!this.pulses[pulse].reversed)
                ++this.charge

            this.pulses.splice(pulse, 1);
        }

        if (this.charge > Structure.PULSE_THRESHOLD)
            this.centerPulse();
    }

    drawNetwork(context) {
        context.strokeStyle = "#fff";

        const widthScale = .1;

        for (let end of this.ends) {
            let width = 1;

            while (end.parent) {
                context.lineWidth = ++width * widthScale;
                context.beginPath();
                context.moveTo(
                    (end.x + end.parent.x) * .5,
                    (end.y + end.parent.y) * .5);

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

                context.stroke();

                end = end.parent;
            }
        }

        context.beginPath();
        context.arc(this.x, this.y, Structure.CENTER_RADIUS, 0, Math.PI * 2);
        context.fill();
    }

    drawPulses(context) {
        for (let pulse = 0, pulseCount = this.pulses.length; pulse < pulseCount; ++pulse)
            this.pulses[pulse].draw(context);

        if (this.discharge) {
            context.fillStyle = "#eed680";

            context.beginPath();
            context.arc(this.x, this.y, Structure.CENTER_RADIUS, 0, Math.PI * 2);
            context.fill();
        }
    }

    drawPulsesLight(context) {
        for (let pulse = 0, pulseCount = this.pulses.length; pulse < pulseCount; ++pulse)
            this.pulses[pulse].drawLight(context);

        if (this.discharge) {
            const radius = Structure.CENTER_RADIUS * 5 * this.discharge / Structure.DISCHARGE;
            const gradient = context.createRadialGradient(
                this.x,
                this.y,
                0,
                this.x,
                this.y,
                radius);

            gradient.addColorStop(0, "rgba(248,247,227,0.58)");
            gradient.addColorStop(1, "rgba(255,255,255,0)");

            context.fillStyle = gradient;

            context.beginPath();
            context.arc(
                this.x,
                this.y,
                radius,
                0,
                Math.PI * 2);
            context.fill();
        }
    }
}