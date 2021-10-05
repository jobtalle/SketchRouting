import {Routing} from "./routing.js";

let routing = null;
const wrapper = document.getElementById("wrapper");
const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");
const resize = () => {
    canvas.width = wrapper.clientWidth;
    canvas.height = wrapper.clientHeight;

    routing = new Routing(canvas, canvas.width, canvas.height);
};

const loop = () => {
    routing.update();
    routing.draw(context);

    requestAnimationFrame(loop);
};

wrapper.appendChild(canvas);
window.onresize = resize;

resize();
requestAnimationFrame(loop);

window.addEventListener("keydown", event => {
    if (event.key === " ")
        resize();
});