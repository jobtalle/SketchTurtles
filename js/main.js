import {Turtles} from "./turtles.js";

{
    const UPDATE_RATE = 1 / 10;
    const TIME_STEP_MAX = 1 / 5;

    let turtles = null;

    const canvas = document.getElementById("renderer");
    const resize = window.onresize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        if (turtles)
            turtles.resize(canvas.width, canvas.height);
    };

    resize();

    turtles = new Turtles();

    let lastTime = performance.now();
    let updateTime = 0;

    const loop = time => {
        const delta = Math.min(TIME_STEP_MAX, .001 * (time - lastTime));

        updateTime += delta;

        while (updateTime > UPDATE_RATE) {
            turtles.update();

            updateTime -= UPDATE_RATE;
        }

        turtles.frame(updateTime / UPDATE_RATE);

        lastTime = time;

        requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
}