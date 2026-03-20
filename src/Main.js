import { initShaderProgram } from "../src/init-shaders.js";
import { initCubeBuffer } from "../src/innit-buffer.js";
import { SpObj } from "../src/object.js";
import { player } from "../src/innit-player.js";
import { innit_camera } from "../src/innit-camera.js";
import { innit_npcManager } from "../src/npc.js";
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
start();


function start() {
    keys["mouseP"] = [0, 0]
    // add event listeners for key presses
    window.addEventListener("keydown", (e) => {
        keys[e.key] = true;
        if (e.key == "f") {
            npcM.add(gl);
        }
    });

    window.addEventListener("keyup", (e) => {
        keys[e.key] = false;
    });

    window.addEventListener("mousemove", (e) => {
        keys["mouseP"] = [e.clientX - OFF_WIDTH,SCR_HEIGHT- e.clientY + OFF_HEIGHT]
    })

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
    obj = new SpObj(gl, [0, 2.5, 0], [0, 0, 0], [2, 2, 17], "wall", initCubeBuffer(gl, [0, 1, 2, 3, 4, 5]));
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
    camera.size(gl, SCR_WIDTH*4, SCR_HEIGHT*4);
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
            obj.npcs.forEach(npc => {
                gl.uniform1i(programClick.uniformLocations.id, count);
                npc.obj.drawScene(gl, programClick);
                count += 1;
            });
        } else {

            gl.uniform1i(programClick.uniformLocations.id, count);
            obj.drawScene(gl, programClick);
            count += 1;
        }
    });

    gl.viewport(0, 0, SCR_WIDTH*4, SCR_HEIGHT*4);
    camera.clear(gl);

    gl.useProgram(programDefault.program);

    gl.uniform2f(programDefault.uniformLocations.test, (keys["mouseP"][0] / SCR_WIDTH-0.5)*0.5+0.5,
         (keys["mouseP"][1] / SCR_HEIGHT-0.5)*0.5+0.5
    );
    
    gl.uniformMatrix4fv(
        programDefault.uniformLocations.projectionMatrix,
        false,
        camera.matrix(),
    );
    objs.forEach(obj => {
        obj.drawScene(gl, programDefault);
    });

    // ---------------------------------



    time += deltaTime;

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(OFF_WIDTH, OFF_HEIGHT, SCR_WIDTH, SCR_HEIGHT);
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniformMatrix4fv(
        programDefault.uniformLocations.projectionMatrix,
        false,
        mat4.create()
    );
    camera.fboObj.drawScene(gl, programDefault);
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
    var dist = Math.sqrt(Math.pow(camera.pos[0] - char.pos[0], 2) + Math.pow(camera.pos[1] - char.pos[1], 2));
    if (dist > 3) {
        // interpolate 
        camera.pos[0] = camera.pos[0] - (camera.pos[0] + char.pos[0]) * deltaTime * 4.0;
        camera.pos[1] = camera.pos[1] - (camera.pos[1] + char.pos[1]) * deltaTime * 4.0;
    }
    Clickcamera.pos = camera.pos;
    Clickcamera.zoom = camera.zoom;
    Clickcamera.rot = camera.rot;

    npcM.npcs.forEach(npc => {

        npc.target = char.pos;
    });
    npcM.update(gl, time, deltaTime, keys);
    const pixel = new Uint8Array(4); // RGBA

    gl.bindFramebuffer(gl.FRAMEBUFFER, Clickcamera.fbo.depthFramebuffer);
    gl.readPixels(
        ((keys["mouseP"][0] / SCR_WIDTH-0.5)*0.5+0.5)*SCR_WIDTH,
        ((keys["mouseP"][1] / SCR_HEIGHT-0.5)*0.5+0.5)*SCR_HEIGHT,
        1,
        1,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        pixel
    );

    //console.log(pixel[0], pixel[1], pixel[2]); // [R, G, B, A

}


///


