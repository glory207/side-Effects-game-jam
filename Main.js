import { initShaderProgram } from "./init-shaders.js";
import { SpObj } from "./object.js";
import { initCubeBuffer } from "./innit-buffer.js";
import { Framebuffer } from "./init-texture.js";
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
var fbo = new Framebuffer(gl);
var fboObj = new SpObj(gl, [0, 0, 0], [0, 0, 0], [2, -2, 2], -1, initCubeBuffer(gl, [9]));
fboObj.texture = fbo.texture;
var objs = [];
var char;
var sz = 50.0;
const keys = {};
start();


function start() {
    
window.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

window.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});
    char = new SpObj(gl, [10, 7, 0], [0, 3, 0], [2, 7, 2], "player", initCubeBuffer(gl, [9]));
    char.textOff = [0, 0, 1/6, 1/4];
    objs.push(char);

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
    obj = new SpObj(gl, [0, 2, 0], [0, 0, 0], [2, 2, 17], "wall", initCubeBuffer(gl, [0,1,2,3,4,5]));
    obj.textOff = [0, 0, obj.sca[2] / 10, obj.sca[2] / 10];
    objs.push(obj);

    
    // back room floor
    obj = new SpObj(gl, [100, 0, 0], [0, 0, 0], [100,60,100], "floor", initCubeBuffer(gl, [11]));
    obj.textOff = [0, 0, obj.sca[2] / 10, obj.sca[0] / 10];
    objs.push(obj);
    
    // back room wall L
    obj = new SpObj(gl, [0, 60, -62.5], [0, 0, 0], [100,60,37.5], "wall", initCubeBuffer(gl, [10]));
    obj.textOff = [0, 0, obj.sca[2] / 10, obj.sca[1] / 10];
    objs.push(obj);

    // back room wall R
    obj = new SpObj(gl, [100, 60, -100], [0, 0, 0], [100,60,100], "wall", initCubeBuffer(gl, [9]));
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
    gl.bindTexture(gl.TEXTURE_2D, fbo.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, SCR_WIDTH*2, SCR_HEIGHT*2, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.depthFramebuffer);
    //gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    gl.bindRenderbuffer(gl.RENDERBUFFER, fbo.RBOP);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH24_STENCIL8, SCR_WIDTH*2, SCR_HEIGHT*2);
    gl.viewport(0, 0, SCR_WIDTH*2, SCR_HEIGHT*2);


    frameCount++;
    now *= 0.001; // convert to seconds
    deltaTime = now - then;
    frameTime += deltaTime;
    then = now;
    if (frameTime > 1.0) {

        frameCount = 0;
        frameTime = 0;
    }



    gl.clearColor(0.2, 0.5, 0.8, 1.0); // Clear to black, fully opaque
    gl.clearDepth(1.0); // Clear everything
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.enable(gl.BLEND); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    // Clear the canvas before we start drawing on it.

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    const zNear = 0.01;
    const zFar = 10000.0;
    const projectionMatrix = mat4.create();
    const view = mat4.create();
    
    mat4.perspective(projectionMatrix, (45 * Math.PI) / 180,1, zNear, zFar);

    // start drawing the square.
    var rot = [(-45 * Math.PI) / 180, (20 * Math.PI) / 180, 0];
    //var rot = [0,time, 0];
    mat4.translate(
        view, // destination matrix
        view, // matrix to translate
        [0, 0, -sz],
    ); // amount to translate
    mat4.rotate(
        view, // destination matrix
        view, // matrix to rotate
        -rot[0], // amount to rotate in radians
        [1, 0, 0],
    )
    mat4.rotate(
        view, // destination matrix
        view, // matrix to rotate
        -rot[1], // amount to rotate in radians
        [0, 1, 0],
    )
    mat4.rotate(
        view, // destination matrix
        view, // matrix to rotate
        -rot[2], // amount to rotate in radians
        [0, 0, 1],
    )
    
    mat4.translate(
        view, // destination matrix
        view, // matrix to translate
        [-char.pos[0], 0, -char.pos[2]],
    ); // amount to translate
    
    var vv = 1 / sz;
    //mat4.scale(
    //    view, // destination matrix
    //    view, // matrix to scale
    //    [vv, vv, vv],
    //);
    // start drawing the square.
    mat4.multiply(view, projectionMatrix, view)

    gl.useProgram(programInfo.program);
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        view,
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
    fboObj.drawScene(gl, programInfo);
    requestAnimationFrame(render);

}
function update() {
    var move = [0,0]
    
    if (keys["c"]) {
        sz = 500.0;
    }else{
        sz = 250.0;
    }
    if (keys["w"]) {
        move[1] -= 1;
    char.textOff = [Math.floor(time*10), 3, 1/6, 1/4];
    }
    if (keys["s"]) {
        move[1] += 1;
    char.textOff = [Math.floor(time*10), 0, 1/6, 1/4];
    }
    if (keys["a"]) {
        move[0] -= 1;
    char.textOff = [Math.floor(time*10), 2, 1/6, 1/4];
    }
    if (keys["d"]) {
        move[0] += 1;
        char.textOff = [Math.floor(time*10), 1, 1/6, 1/4];
    }
    var len = Math.sqrt(move[0] * move[0] + move[1] * move[1]);
    var rot = (-20 * Math.PI) / 180;
    if (len > 0) {
        move[0] /= len;
        move[1] /= len;
        len = Math.sqrt(move[0] * move[0] + move[1] * move[1]);
        move = [move[0] * Math.cos(rot) - move[1] * Math.sin(rot), move[0] * Math.sin(rot) + move[1] * Math.cos(rot)];
        char.pos[0] += move[0] * deltaTime * 30;
        char.pos[2] += move[1] * deltaTime * 30;
    }
    
}


///


