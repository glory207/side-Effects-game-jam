import { initShaderProgram } from "./init-shaders.js";
import { initCubeBuffer } from "./innit-buffer.js";
import { SpObj } from "./object.js";
import { player } from "./innit-player.js";
import { innit_camera } from "./innit-camera.js";
var canvas = document.getElementById("glcanvas");
var body = document.getElementById("glcanvas");

const gl = canvas.getContext("webgl2");

var programInfo = initShaderProgram(gl, "defaultShader", "defaultShader");

var frameCount = 0;
var frameTime = 0;
let time = 0.0;
let deltaTime = 0;
let then = 0;

var SCR_WIDTH = 1600;
var SCR_HEIGHT = 900;
var OFF_WIDTH = 0;
var OFF_HEIGHT = 0;
var camera = new innit_camera(gl);

// list of all the objects in the scene
var objs = [];
var char;
const keys = {};
start();


function start() {
    // add event listeners for key presses
    window.addEventListener("keydown", (e) => {
        keys[e.key] = true;
    });

    window.addEventListener("keyup", (e) => {
        keys[e.key] = false;
    });


    char = new player(gl);
    objs.push(char.obj);
    // create the scene objects ill just hardcode them in here for now, eventually ill want to load them from a file or something
    var obj;
    // front room floor
    obj = new SpObj(gl, [-25, 0, 0], [0, 0, 0], [25, 30, 25], "floor", initCubeBuffer(gl, [11]));
    obj.textOff = [0, 0, obj.sca[2] / 10, obj.sca[0] / 10];
    objs.push(obj);

    // front room wall L
    obj = new SpObj(gl, [-50, 30, 0], [0, 0, 0], [25, 30, 25], "wall", initCubeBuffer(gl, [10]));
    obj.textOff = [0, 0, obj.sca[2] / 10, obj.sca[1] / 10];
    objs.push(obj);

    // front room wall R
    obj = new SpObj(gl, [-25, 30, -25], [0, 0, 0], [25, 30, 25], "wall", initCubeBuffer(gl, [9]));
    obj.textOff = [0, 0, obj.sca[0] / 10, obj.sca[1] / 10];
    objs.push(obj);

    // table
    obj = new SpObj(gl, [0, 2, 0], [0, 0, 0], [2, 2, 17], "wall", initCubeBuffer(gl, [0, 1, 2, 3, 4, 5]));
    obj.textOff = [0, 0, obj.sca[2] / 10, obj.sca[2] / 10];
    objs.push(obj);


    // back room floor
    obj = new SpObj(gl, [100, 0, 0], [0, 0, 0], [100, 60, 100], "floor", initCubeBuffer(gl, [11]));
    obj.textOff = [0, 0, obj.sca[2] / 10, obj.sca[0] / 10];
    objs.push(obj);

    // back room wall L
    obj = new SpObj(gl, [0, 60, -62.5], [0, 0, 0], [100, 60, 37.5], "wall", initCubeBuffer(gl, [10]));
    obj.textOff = [0, 0, obj.sca[2] / 10, obj.sca[1] / 10];
    objs.push(obj);

    // back room wall R
    obj = new SpObj(gl, [100, 60, -100], [0, 0, 0], [100, 60, 100], "wall", initCubeBuffer(gl, [9]));
    obj.textOff = [0, 0, obj.sca[0] / 10, obj.sca[1] / 10];
    objs.push(obj);


    requestAnimationFrame(render);

}
function render(now) {
    update();
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    // makes sure the screen is 16 by 9
    if (canvas.width * 9 > canvas.height * 16) {
        SCR_WIDTH = canvas.height * (16.0 / 9.0);
        OFF_HEIGHT = 0;
        OFF_WIDTH = (canvas.width - SCR_WIDTH) / 2;
        SCR_HEIGHT = canvas.height;
    }
    else {
        SCR_WIDTH = canvas.width;
        OFF_WIDTH = 0;
        OFF_HEIGHT = (canvas.height - SCR_HEIGHT) / 2;
        SCR_HEIGHT = canvas.width * (9.0 / 16.0);
    }
    camera.size(gl, SCR_WIDTH, SCR_HEIGHT);
    frameCount++;
    now *= 0.001; // convert to seconds
    deltaTime = now - then;
    frameTime += deltaTime;
    then = now;
    if (frameTime > 1.0) {

        frameCount = 0;
        frameTime = 0;
    }


    camera.clear(gl);


    gl.useProgram(programInfo.program);
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        camera.matrix(),
    );
    objs.forEach(obj => {
        obj.drawScene(gl, programInfo);
    });
    time += deltaTime;

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(OFF_WIDTH, OFF_HEIGHT, SCR_WIDTH, SCR_HEIGHT);
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        mat4.create()
    );
    camera.fboObj.drawScene(gl, programInfo);
    requestAnimationFrame(render);

}
function update() {
    // zoom camera out
    if (keys["c"]) {
        camera.zoom = 500.0;
    } else {
        camera.zoom = 250.0;
    }
    char.update(gl, time, deltaTime, keys);
}


///


