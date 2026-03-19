import { initCubeBuffer } from "./innit-buffer.js";
import { Framebuffer } from "./init-texture.js";
import { SpObj } from "./object.js";

class innit_camera {
    constructor(gl) {

        this.rot = [(-45 * Math.PI) / 180, (20 * Math.PI) / 180, 0];
        this.pos = [0, 0];
        // create a framebuffer and an object to render it to
        this.fbo = new Framebuffer(gl);
        this.fboObj = new SpObj(gl, [0, 0, 0], [0, 0, 0], [2, -2, 2], -1, initCubeBuffer(gl, [9]));
        this.offset_size = [0, 0, 1, 1];
        this.zoom = 1;
    }
    size(gl, SCR_WIDTH, SCR_HEIGHT) {

        gl.bindTexture(gl.TEXTURE_2D, this.fbo.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, SCR_WIDTH * 2, SCR_HEIGHT * 2, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo.depthFramebuffer);

        gl.bindRenderbuffer(gl.RENDERBUFFER, this.fbo.RBOP);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH24_STENCIL8, SCR_WIDTH * 2, SCR_HEIGHT * 2);
        gl.viewport(0, 0, SCR_WIDTH * 2, SCR_HEIGHT * 2);

    }
    clear(gl) {

        gl.clearColor(0.2, 0.5, 0.8, 1.0); // Clear to black, fully opaque
        gl.clearDepth(1.0); // Clear everything
        gl.enable(gl.DEPTH_TEST); // Enable depth testing
        gl.enable(gl.BLEND); // Enable depth testing
        gl.depthFunc(gl.LEQUAL); // Near things obscure far things
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        // Clear the canvas before we start drawing on it.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    matrix() {

        const zNear = 0.01;
        const zFar = 10000.0;
        const projectionMatrix = mat4.create();
        const view = mat4.create();

        mat4.perspective(projectionMatrix, (45 * Math.PI) / 180, 1, zNear, zFar);

        // start drawing the square.
        
        mat4.translate(
            view, // destination matrix
            view, // matrix to translate
            [0, 0, -this.zoom],
        ); // amount to translate
        mat4.rotate(
            view, // destination matrix
            view, // matrix to rotate
            -this.rot[0], // amount to rotate in radians
            [1, 0, 0],
        )
        mat4.rotate(
            view, // destination matrix
            view, // matrix to rotate
            -this.rot[1], // amount to rotate in radians
            [0, 1, 0],
        )
        mat4.rotate(
            view, // destination matrix
            view, // matrix to rotate
            -this.rot[2], // amount to rotate in radians
            [0, 0, 1],
        )

        mat4.translate(
            view, // destination matrix
            view, // matrix to translate
            [-this.pos[0], 0, -this.pos[1]],
        ); // amount to translate

        mat4.multiply(view, projectionMatrix, view)
        return view;
    }

}
export { innit_camera };