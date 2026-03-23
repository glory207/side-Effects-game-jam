import { initShaderProgram } from "../src/init-shaders.js";
import { player } from "../src/innit-player.js";
import { innit_camera } from "../src/innit-camera.js";
import { innit_npcManager } from "../src/npc.js";
import { UImannager } from "./ui.js";
import { innit_scene } from "./scene.js";
document.addEventListener("contextmenu", e => e.preventDefault());
var canvas = document.getElementById("glcanvas");

const gl = canvas.getContext("webgl2");

var programDefault = initShaderProgram(gl, "defaultShader", "defaultShader");
var programClick = initShaderProgram(gl, "defaultShader", "clickShader");

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
var Clickcamera = new innit_camera(gl);

// list of all the objects in the scene
var char = new player(gl);
var npcM = new innit_npcManager();
var objs = new innit_scene(gl,char,npcM);
const keys = {};
const pixel = new Uint8Array(4); // RGBA
var ui = new UImannager(gl);
start();

function start() {
    keys["mouseP"] = [0, 0]
    // add event listeners for key presses
    window.addEventListener("keydown", (e) => {
        keys[e.key] = true;
        if (e.key == "f") {
            npcM.add(gl);
        }

        if (keys["e"]) {
            char.working = !char.working;
            ui.popup = null;
        }

    });

    window.addEventListener("keyup", (e) => {
        keys[e.key] = false;
    });

    window.addEventListener("mousemove", (e) => {
        keys["mouseP"] = [e.clientX - OFF_WIDTH, SCR_HEIGHT - e.clientY + OFF_HEIGHT]
    });

    window.addEventListener("mousedown", (e) => {
        keys["mouseD"] = true;
    });
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
    camera.size(gl, SCR_WIDTH * 4, SCR_HEIGHT * 4);
    Clickcamera.size(gl, SCR_WIDTH, SCR_HEIGHT);
    frameCount++;
    now *= 0.001; // convert to seconds
    deltaTime = now - then;
    frameTime += deltaTime;
    then = now;
    if (frameTime > 1.0) {

        frameCount = 0;
        frameTime = 0;
    }


    gl.viewport(0, 0, SCR_WIDTH * 4, SCR_HEIGHT * 4);
    camera.clear(gl);

    gl.useProgram(programDefault.program);

    gl.uniform2f(programDefault.uniformLocations.test, (keys["mouseP"][0] / SCR_WIDTH - 0.5) * 0.5 + 0.5,
        (keys["mouseP"][1] / SCR_HEIGHT - 0.5) * 0.5 + 0.5
    );

    gl.uniformMatrix4fv(
        programDefault.uniformLocations.projectionMatrix,
        false,
        camera.matrix(),
    );


    function draw(lst) {
        lst.forEach(i => {
            if (i != null) {
                if (i.type.children) {
                    draw(i.children);
                } else {
                    i.drawScene(gl, programDefault);
                }
            }
        });
    }
    draw(objs.children);

    mat = mat4.create();
    mat4.scale(
        mat, // destination matrix
        mat, // matrix to translate
        [1 / 16, 1 / 9, 1],
    ); // amount to translate
    gl.uniformMatrix4fv(
        programDefault.uniformLocations.projectionMatrix,
        false,
        mat
    );

    draw(ui.children);
    ui.reset();
    // ---------------------------------


    gl.viewport(0, 0, SCR_WIDTH, SCR_HEIGHT);
    Clickcamera.clear(gl);

    gl.useProgram(programClick.program);
    gl.uniformMatrix4fv(
        programClick.uniformLocations.projectionMatrix,
        false,
        Clickcamera.matrix(),
    );
    var count = 0

    function drawClick(lst) {
        lst.forEach(i => {
            if (i != null) {

                if (i.type.children) {
                    drawClick(i.children);
                } else {
                    gl.uniform2f(programClick.uniformLocations.id, count, 0);
                    i.drawScene(gl, programClick);
                    i.hover = false;
                    i.click = false;
                    if (pixel[0] == count) {
                        i.hover = true;
                        if (keys["mouseD"]) {
                            i.click = true;
                            console.log(pixel[0], pixel[1], pixel[2]);
                        }
                    }
                    count += 1;

                }
            }
        });
    }
    drawClick(objs.children);

    var mat = mat4.create();
    mat4.scale(
        mat, // destination matrix
        mat, // matrix to translate
        [1 / 16, 1 / 9, 1],
    ); // amount to translate
    gl.uniformMatrix4fv(
        programClick.uniformLocations.projectionMatrix,
        false,
        mat
    );

    drawClick(ui.children)
    keys["mouseD"] = false;

    gl.useProgram(programDefault.program);

    gl.uniformMatrix4fv(
        programDefault.uniformLocations.projectionMatrix,
        false,
        mat4.create()
    );
    time += deltaTime;

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(OFF_WIDTH, OFF_HEIGHT, SCR_WIDTH, SCR_HEIGHT);
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    camera.fboObj.drawScene(gl, programDefault);
    requestAnimationFrame(render);

}
function update() {

    // zoom camera out
    if (keys["c"]) {
        camera.zoom = 500.0;
    } else {
        camera.zoom = 150.0;
    }
    char.update(gl, time, deltaTime, keys);
    if (char.working) {

        // interpolate
        camera.pos[0] = camera.pos[0] - (camera.pos[0] + char.pos[0] + 10) * deltaTime * 4.0;
        camera.pos[2] = camera.pos[2] - (camera.pos[2] + char.pos[1]) * deltaTime * 4.0;
    } else {
        // interpolate
        camera.pos[0] = camera.pos[0] - (camera.pos[0] + char.pos[0]) * deltaTime * 4.0;
        camera.pos[2] = camera.pos[2] - (camera.pos[2] + char.pos[1]) * deltaTime * 4.0;
        camera.pos[1] = camera.pos[1] - (camera.pos[1] + char.obj.pos[1]) * deltaTime * 4.0;
    }
    Clickcamera.pos = camera.pos;
    Clickcamera.zoom = camera.zoom;
    Clickcamera.rot = camera.rot;

    npcM.update(gl, time, deltaTime, keys);


    gl.bindFramebuffer(gl.FRAMEBUFFER, Clickcamera.fbo.depthFramebuffer);
    gl.readPixels(
        ((keys["mouseP"][0] / SCR_WIDTH - 0.5) * 0.5 + 0.5) * SCR_WIDTH,
        ((keys["mouseP"][1] / SCR_HEIGHT - 0.5) * 0.5 + 0.5) * SCR_HEIGHT,
        1,
        1,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        pixel
    );
    objs.children.forEach(obj => {
        obj.update(gl, time, deltaTime, keys);
    });
    ui.update(gl, time, deltaTime, keys);
    //console.log(pixel[0], pixel[1], pixel[2]); // [R, G, B, A



}



