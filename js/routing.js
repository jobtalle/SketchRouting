import {Structure} from "./structure.js";
import {Random} from "./random.js";

export class Routing {
    constructor(element, width, height) {
        const seed = Math.floor(Math.random() * Random.MODULUS);

        console.warn(seed);

        this.width = width;
        this.height = height;
        this.structure = new Structure(width, height, new Random(seed));
        this.background = document.createElement("canvas");
        this.background.width = width;
        this.background.height = height;
        this.random = new Random(seed);

        this.structure.drawNetwork(this.background.getContext("2d"));

        let down = false;

        element.addEventListener("mousedown", event => {
            this.structure.touch(event.clientX, event.clientY);

            down = true;
        });

        element.addEventListener("mousemove", event => {
            if (down)
                this.structure.touch(event.clientX, event.clientY);
        });

        element.addEventListener("mouseup", () => {
            down = false;
        });
    }

    update() {
        this.structure.update(this.random);
    }

    draw(context) {
        context.clearRect(0, 0, this.width, this.height);
        context.drawImage(this.background, 0, 0);

        this.structure.draw(context);
    }
}