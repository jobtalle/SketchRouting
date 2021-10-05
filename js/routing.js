import {Grid} from "./grid.js";

export class Routing {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.grid = new Grid(width, height);
        this.background = document.createElement("canvas");
        this.background.width = width;
        this.background.height = height;

        this.grid.draw(this.background.getContext("2d"))
    }

    draw(context) {
        context.clearRect(0, 0, this.width, this.height);
        context.drawImage(this.background, 0, 0);
    }
}