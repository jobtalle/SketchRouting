import {Structure} from "./structure.js";
import {Random} from "./random.js";

export class Routing {
    static PULSE_ZOOM = .01;
    static PULSE_POWER = 8;

    constructor(element, width, height) {
        const seed = Math.floor(Math.random() * Random.MODULUS);
        // const seed = 394342599;
        console.warn(seed);

        this.width = width;
        this.height = height;
        this.structure = new Structure(width, height, width * .5, height * .5, new Random(seed));
        this.background = document.createElement("canvas");
        this.background.width = width;
        this.background.height = height;
        this.random = new Random(seed);

        this.structure.drawNetwork(this.background.getContext("2d"));

        element.addEventListener("mousedown", event => {
            this.structure.touch(event.clientX, event.clientY, this.random);
        });
    }

    update() {
        this.structure.update(this.random);
    }

    draw(context) {
        context.save();

        const zoom = this.structure.zoom;

        if (zoom !== 0) {
            const scale = Math.sin(Math.PI * Math.pow(zoom, Routing.PULSE_POWER)) * Routing.PULSE_ZOOM;

            context.translate(this.width * .5, this.height * .5);
            context.scale(1 + scale, 1 + scale);
            context.translate(-this.width * .5, -this.height * .5);
        }

        const lineGradient = context.createRadialGradient(
            this.width * .5,
            this.height * .5,
            0,
            this.width * .5,
            this.height * .5,
            .5 * Math.sqrt(this.width * this.width + this.height * this.height));

        lineGradient.addColorStop(0, "#172c4e");
        lineGradient.addColorStop(1, "#172c4e");

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

        context.restore();
    }
}