import {Node} from "./node.js";

export class Routing {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.background = document.createElement("canvas");
        this.background.width = width;
        this.background.height = height;
        this.nodes = this.createNodes();

        const backgroundContext = this.background.getContext("2d");

        for (let node = 0, nodes = this.nodes.length; node < nodes; ++node)
            this.nodes[node].draw(backgroundContext);
    }

    createNodes() {
        const nodes = [];

        for (let i = 0; i < 1000; ++i)
            nodes.push(new Node(Math.random() * this.width, Math.random() * this.height));

        return nodes;
    }

    draw(context) {
        context.clearRect(0, 0, this.width, this.height);
        context.drawImage(this.background, 0, 0);
    }
}