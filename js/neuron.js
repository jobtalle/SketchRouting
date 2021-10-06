export class Neuron {
    constructor(x, y, radius, length = 0, parent = null) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.parent = parent;
        this.children = [];
        this.length = length;
    }

    addChild(neuron) {
        this.children.push(neuron);
    }
}