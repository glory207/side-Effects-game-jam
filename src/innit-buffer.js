
const positionsCube = new Array(
    [// Front face 0
        -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
    ], [// Back face 1
    -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,
], [// Top face 2
    -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,
], [// Bottom face 3
    -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
], [// Right face 4
    1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,
], [// Left face 5
    -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
], [// Z face L 6
    -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0, -1.0, 1.0, 0.0,
], [// X face F 7
    0.0, -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0, -1.0, 1.0,
], [// Y face T 8
    -1.0, 0.0, -1.0, -1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, -1.0,

], [// X face full 9
    -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0, -1.0, 1.0, 0.0,
], [// Y face full 10
    0.0, -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0, -1.0, 1.0,
], [// Z face full 11
    -1.0, 0.0, -1.0, -1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, -1.0,

]);
const textureCoordinatesCube = new Array(
    [ // Front
        0.375, 0.75, 0.375, 1, 0.625, 1, 0.625, 0.75,
    ], [// Back
    0.375, 0.5, 0.625, 0.5, 0.625, 0.25, 0.375, 0.25,
], [// Top
    0.625, 0.5, 0.875, 0.5, 0.875, 0.25, 0.625, 0.25,
], [// Bottom
    0.125, 0.25, 0.125, 0.5, 0.375, 0.5, 0.375, 0.25,
], [// Right
    0.375, 0.25, 0.625, 0.25, 0.625, 0, 0.375, 0,
], [// Left

    0.375, 0.5, 0.375, 0.75, 0.625, 0.75, 0.625, 0.5,
], [// X face
    0.0, 0.75, 0.0, 0.5, 0.25, 0.5, 0.25, 0.75,
], [// Y face
    0.75, 0.75, 1.0, 0.75, 1.0, 1.0, 0.75, 1.0,
], [// Z face
    0.25, 1.0, 0.25, 0.75, 0.0, 0.75, 0.0, 1.0,
], [// X face full
   0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0,
], [// Y face full
    1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0,
], [// Z face full
    1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
]
);


function initCubeBuffer(gl, sides) {

    return {
        position: initPositionBuffer(gl, sides),
        texturePos: initTextureBuffer(gl, sides),
        indices: initIndexBuffer(gl, sides),
        length: sides.length * 6,
    };

}

function initPositionBuffer(gl, sides) {
    // Create a buffer for the square's positions.
    const positionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    var positions = new Array();
    for (var j = 0; j < sides.length; j++) {
        positions = positions.concat(positionsCube[sides[j]]);
    }

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    return positionBuffer;
}
function initIndexBuffer(gl, sides) {
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    var indices = new Array();
    for (var j = 0; j < sides.length; j++) {
        indices = indices.concat([2 + (4 * j), 1 + (4 * j), 0 + (4 * j), 3 + (4 * j), 2 + (4 * j), 0 + (4 * j)]);
    }


    // Now send the element array to GL

    gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indices),
        gl.STATIC_DRAW
    );

    return indexBuffer;
}
function initTextureBuffer(gl, sides) {
    const textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

    var textureCoordinates = new Array();
    for (var j = 0; j < sides.length; j++) {
        textureCoordinates = textureCoordinates.concat(textureCoordinatesCube[sides[j]]);
    }


    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(textureCoordinates),
        gl.STATIC_DRAW
    );

    return textureCoordBuffer;
}


export { initCubeBuffer };