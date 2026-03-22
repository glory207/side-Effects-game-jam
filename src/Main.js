import { initShaderProgram } from "../src/init-shaders.js";
import { initCubeBuffer } from "../src/innit-buffer.js";
import { SpObj } from "../src/object.js";
import { player } from "../src/innit-player.js";
import { innit_camera } from "../src/innit-camera.js";
import { innit_npcManager } from "../src/npc.js";
import { UImannager } from "./ui.js";
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
var objs = [];
var char = new player(gl);
var npcM = new innit_npcManager();
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
        if (pixel[0] < objs.length) {
            if (objs[pixel[0]].type == "npc") {
                objs[pixel[0]].clicked(pixel[1]);
            }
            if (objs[pixel[0]].type == "chest") {
                char.working = !char.working;
                objs[pixel[0]].textOff[0] += 1;
            }
            if (objs[pixel[0]].type == "pestle") {
                char.working = true;
                ui.add(gl);
            }
        } else if (pixel[0] > objs.length){
            
        }else if(ui.popup != null){
            ui.popup.uis[pixel[1]].click = true;
        }
    });

    objs.push(char.obj);

    // create the scene objects ill just hardcode them in here for now, eventually ill want to load them from a file or something
    var obj;

    obj = new SpObj(gl, [30, 11, -80], [0, (0 * Math.PI) / 180, 0], [5, 10, 5], "pestle", initCubeBuffer(gl, [9]));
    obj.textOff = [0, 0, 1.0 / 8.0, 1];
    obj.type = "pestle";
    objs.push(obj);

    obj = new SpObj(gl, [5, 8, -80], [0, (75 * Math.PI) / 180, 0], [7, 7, 7], "chest", initCubeBuffer(gl, [9]));
    obj.textOff = [0, 0, 0.5, 1];
    obj.type = "chest";
    objs.push(obj);

    obj = new SpObj(gl, [5, 8, -55], [0, (75 * Math.PI) / 180, 0], [7, 7, 7], "chest", initCubeBuffer(gl, [9]));
    obj.textOff = [0, 0, 0.5, 1];
    obj.type = "chest";
    objs.push(obj);

    obj = new SpObj(gl, [5, 8, -30], [0, (75 * Math.PI) / 180, 0], [7, 7, 7], "chest", initCubeBuffer(gl, [9]));
    obj.textOff = [0, 0, 0.5, 1];
    obj.type = "chest";
    objs.push(obj);

    obj = new SpObj(gl, [5, 8, 80], [0, (75 * Math.PI) / 180, 0], [7, 7, 7], "chest", initCubeBuffer(gl, [9]));
    obj.textOff = [0, 0, 0.5, 1];
    obj.type = "chest";
    objs.push(obj);

    obj = new SpObj(gl, [5, 8, 55], [0, (75 * Math.PI) / 180, 0], [7, 7, 7], "chest", initCubeBuffer(gl, [9]));
    obj.textOff = [0, 0, 0.5, 1];
    obj.type = "chest";
    objs.push(obj);

    obj = new SpObj(gl, [5, 8, 30], [0, (75 * Math.PI) / 180, 0], [7, 7, 7], "chest", initCubeBuffer(gl, [9]));
    obj.textOff = [0, 0, 0.5, 1];
    obj.type = "chest";
    objs.push(obj);
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
    obj = new SpObj(gl, [0, 2.5, 0], [0, 0, 0], [2, 2, 17], "wall", initCubeBuffer(gl, [0, 1, 2, 3, 4, 5]));
    obj.textOff = [0, 0, obj.sca[2] / 10, obj.sca[2] / 10];
    obj.type = "table";
    objs.push(obj);

    // table2
    obj = new SpObj(gl, [100, 2.5, 0], [0, 0, 0], [40, 2, 17], "wall", initCubeBuffer(gl, [0, 1, 2, 3, 4, 5]));
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

    objs.push(npcM)

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
    objs.forEach(obj => {
        obj.drawScene(gl, programDefault);
    });
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
    for (var i = 1; i < ui.uis.length; i++)  {

        ui.uis[i].drawScene(gl, programDefault);
    }
    if (ui.popup != null) {
        ui.popup.uis.forEach(obj => {

            obj.drawScene(gl, programDefault);
        });
    }
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
    objs.forEach(obj => {
        if (obj.type == "npc") {
            var count2 = 0;
            obj.npcs.forEach(npc => {
                gl.uniform2f(programClick.uniformLocations.id, count, count2);
                npc.obj.drawScene(gl, programClick);
                count2 += 1;
            });
            count += 1;
        } else {

            gl.uniform2f(programClick.uniformLocations.id, count, 0);
            obj.drawScene(gl, programClick);
            count += 1;
        }
    });
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
    var count2 = 0;
    if (ui.popup != null) {
        ui.popup.uis.forEach(obj => {

            gl.uniform2f(programClick.uniformLocations.id, count, count2);
            obj.drawScene(gl, programClick);
            count2 += 1;
        });
    }
    count += 1;
    for (var i = 1; i < ui.uis.length; i++) {
        gl.uniform2f(programClick.uniformLocations.id, count, 0);
        ui.uis[i].drawScene(gl, programClick);
        count += 1;
    }


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
        camera.pos[1] = camera.pos[1] - (camera.pos[1] + char.pos[1]) * deltaTime * 4.0;
    } else {
        // interpolate
        camera.pos[0] = camera.pos[0] - (camera.pos[0] + char.pos[0]) * deltaTime * 4.0;
        camera.pos[1] = camera.pos[1] - (camera.pos[1] + char.pos[1]) * deltaTime * 4.0;
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
    ui.update(gl, time, deltaTime, keys);
    //console.log(pixel[0], pixel[1], pixel[2]); // [R, G, B, A
    if (pixel[0] < objs.length) {
        if (objs[pixel[0]].type == "pestle") {
            objs[pixel[0]].textOff[0] = Math.floor(time * 10);
        }
    } else if (pixel[0] > objs.length){
        if (ui.uis[pixel[0] - objs.length].type == "inventory") {
            ui.uis[pixel[0] - objs.length].off[1] = 0.15;

        }
    } else if(ui.popup != null){

    }


}


///


