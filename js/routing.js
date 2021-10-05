import {Structure} from "./structure.js";
import {Random} from "./random.js";

export class Routing {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.structure = new Structure(width, height, new Random(Math.floor(Math.random() * Random.MODULUS)));
        this.background = document.createElement("canvas");
        this.background.width = width;
        this.background.height = height;

        this.structure.draw(this.background.getContext("2d"))
    }

    draw(context) {
        context.clearRect(0, 0, this.width, this.height);
        context.drawImage(this.background, 0, 0);
    }
}