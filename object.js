import { loadTexture } from "./init-texture.js";

class SpObj {
    constructor(gl, pos, rot, sca, imj, buffer) {
        this.rot = rot;
        this.pos = pos;
        this.sca = sca;
        this.textOff = [0, 0, 1, 1];

        this.buffers = buffer;
        this.texture = loadTexture(gl, imj);

    }

    drawScene(gl, programInfo) {

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);


        const modelViewMatrix = mat4.create();



        mat4.translate(
            modelViewMatrix, // destination matrix
            modelViewMatrix, // matrix to translate
            [this.pos[0], this.pos[1], this.pos[2]],
        ); // amount to translate
        // start drawing the square.


        mat4.rotate(
            modelViewMatrix, // destination matrix
            modelViewMatrix, // matrix to rotate
            this.rot[2], // amount to rotate in radians
            [0, 0, 1],
        )

        mat4.rotate(
            modelViewMatrix, // destination matrix
            modelViewMatrix, // matrix to rotate
            this.rot[1], // amount to rotate in radians
            [0, 1, 0],
        )

        mat4.rotate(
            modelViewMatrix, // destination matrix
            modelViewMatrix, // matrix to rotate
            this.rot[0], // amount to rotate in radians
            [1, 0, 0],
        )


        mat4.scale(
            modelViewMatrix, // destination matrix
            modelViewMatrix, // matrix to scale
            [this.sca[0], this.sca[1], this.sca[2]],
        );


        // Set the shader uniforms
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix,
        );

        gl.uniform4f(
            programInfo.uniformLocations.textureMatrix,
            this.textOff[0], this.textOff[1], this.textOff[2], this.textOff[3]
        );

        if (this.texture != false) {
            // Tell WebGL we want to affect texture unit 0
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
        }
        else {
            gl.bindTexture(gl.TEXTURE_2D, null);
        }

        gl.uniform1i(programInfo.uniformLocations.uSampler1, 0);
        this.setAttribute(gl, this.buffers.position, programInfo.attribLocations.vertexPosition, 3);
        this.setAttribute(gl, this.buffers.texturePos, programInfo.attribLocations.texturePosition, 2);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);

        const vertexcount = this.buffers.length;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexcount, type, offset);

    }

    setAttribute(gl, buffers, attribLocations, numComponents) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers);
        gl.vertexAttribPointer(
            attribLocations,
            numComponents,
            gl.FLOAT,
            false,
            0,
            0,
        );
        gl.enableVertexAttribArray(attribLocations);
    }


}

export { SpObj };