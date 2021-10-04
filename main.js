const wrapper = document.getElementById("wrapper");
const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");
const resize = () => {
    canvas.width = wrapper.clientWidth;
    canvas.height = wrapper.clientHeight;
};

wrapper.appendChild(canvas);
window.onresize = resize;

resize();