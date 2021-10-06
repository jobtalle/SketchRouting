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

        element.addEventListener("mousedown", event => {
            this.structure.touch(event.clientX, event.clientY);
        });
    }

    update() {
        this.structure.update(this.random);
    }

    draw(context) {
        context.globalCompositeOperation = "source-over";

        const lineGradient = context.createRadialGradient(
            this.width * .5,
            this.height * .5,
            0,
            this.width * .5,
            this.height * .5,
            .5 * Math.sqrt(this.width * this.width + this.height * this.height));

        lineGradient.addColorStop(0, "#0b214e");
        lineGradient.addColorStop(1, "rgba(11,33,78,0.42)");

        context.fillStyle = lineGradient;
        context.clearRect(0, 0, this.width, this.height);
        context.beginPath();
        context.rect(0, 0, this.width, this.height);
        context.fill();

        this.structure.drawPulses(context);

        context.globalCompositeOperation = "destination-in";
        context.drawImage(this.background, 0, 0);

        context.globalCompositeOperation = "lighter";
        this.structure.drawPulsesLight(context);
    }
}