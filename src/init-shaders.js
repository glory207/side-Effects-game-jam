

var vsSources = {
    defaultShader:
        `#version 300 es
precision mediump float;
layout(location = 0) in  vec4 aVertexPosition;
layout(location = 1) in  vec2 aTexturePosition;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec4 textureMatrix;
out vec3 pos;


void main() {
    pos = vec3((aTexturePosition + textureMatrix.xy) * textureMatrix.zw,0);
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    }`
};

var fsSources = {
    defaultShader:
`#version 300 es
precision mediump float;
out vec4 fragColor;
uniform sampler2D uSampler1;
uniform vec2 test;

in vec3 pos;

void main() {
    vec4 cc = texture(uSampler1, pos.xy );
    if(cc.w < 0.5) discard;
    if(distance(pos.xy,test)< 0.001)fragColor = vec4(1.0,1.0,1.0,1.0);
    else fragColor = vec4(texture(uSampler1, pos.xy ).xyz,1.0);

}`,
clickShader:`#version 300 es
precision mediump float;
out vec4 fragColor;
uniform sampler2D uSampler1;

uniform vec2 id;
in vec3 pos;

void main() {
    vec4 cc = texture(uSampler1, pos.xy );
    if(cc.w < 0.5) discard;

    fragColor = vec4((id+0.5)/255.0,0,1);

}`,
};
function initShaderProgram(gl, vertexReference, fragmentReference) {
    const vsSource = vsSources[vertexReference];
    const fsSource = fsSources[fragmentReference];
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert(
            `Unable to initialize the shader program: ${gl.getProgramInfoLog(
                shaderProgram,
            )}`,
        );
        return null;
    }

    return  {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
            texturePosition: gl.getAttribLocation(shaderProgram, "aTexturePosition")
        },
        uniformLocations: {
            id: gl.getUniformLocation(shaderProgram, "id"),
            test: gl.getUniformLocation(shaderProgram, "test"),
            uSampler1: gl.getUniformLocation(shaderProgram, "uSampler1"),
            projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
            textureMatrix: gl.getUniformLocation(shaderProgram, "textureMatrix"),
            time: gl.getUniformLocation(shaderProgram, "time"),
        },
    };

}

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);

    // Send the source to the shader object

    gl.shaderSource(shader, source);

    // Compile the shader program

    gl.compileShader(shader);

    // See if it compiled successfully

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(
            `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`,
        );
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}
export { initShaderProgram };