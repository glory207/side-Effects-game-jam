const texturesNames = {
    wall:"../img/1000_F_940486312_SdEehnGNoKKWY6jX40QwEAx2pvrnGxRO.jpg",
    floor:"../img/dc6pbds-a354d62b-93ba-41e0-9b4a-1dd35eb0323b.png",
    player:"../img/a83c07120129749.60abda77d6af9.png",
    chest:"../img/chest-Sheet.png",
};

//
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.
//
var textureUrl = new Array();
var textures = new Array();
// checks if the texture is already loaded, if not loads it and adds to the array, returns the texture
function loadTexture(gl, url) {
    if (url == -1) return false;
    const urli = textureUrl.findIndex((element) => element == texturesNames[url]);

    if (urli == -1) {
        textureUrl.push(texturesNames[url]);
        textures.push(loadTexture2(gl, texturesNames[url]));
        return textures[textures.length - 1];
    }
    else {
        return textures[urli];
    }
}
function loadTexture2(gl, url) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Because images have to be downloaded over the internet
    // they might take a moment until they are ready.
    // Until then put a single pixel in the texture so we can
    // use it immediately. When the image has finished downloading
    // we'll update the texture with the contents of the image.
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
    gl.texImage2D(
        gl.TEXTURE_2D,
        level,
        internalFormat,
        width,
        height,
        border,
        srcFormat,
        srcType,
        pixel,
    );

    const image = new Image();
    image.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
            gl.TEXTURE_2D,
            level,
            internalFormat,
            srcFormat,
            srcType,
            image,
        );

        // WebGL1 has different requirements for power of 2 images
        // vs. non power of 2 images so check if the image is a
        // power of 2 in both dimensions.
        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
            // Yes, it's a power of 2. Generate mips.
            gl.generateMipmap(gl.TEXTURE_2D);
        } else {
            // No, it's not a power of 2. Turn off mips and set
            // wrapping to clamp to edge
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        }
    };
    image.src = url;

    return texture;
}
function isPowerOf2(value) {
    return (value & (value - 1)) === 0;
}

class Framebuffer{
    constructor (gl){
    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(
        gl.TEXTURE_2D,      // target
        0,                  // mip level
        gl.RGBA, // internal format
        1080,   // width
        720,   // height
        0,                  // border
        gl.RGBA, // format
        gl.UNSIGNED_BYTE,           // type
        null);              // data
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  
      this.depthFramebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.depthFramebuffer);
    gl.framebufferTexture2D(
        gl.FRAMEBUFFER,       // target
        gl.COLOR_ATTACHMENT0,  // attachment point
        gl.TEXTURE_2D,        // texture target
      this.texture,         // texture
        0);                   // mip level
  
      this.RBOP = gl.createRenderbuffer();
      gl.bindRenderbuffer(gl.RENDERBUFFER, this.RBOP);
      gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH24_STENCIL8, 1080, 720);
      gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, this.RBOP);
  
      
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
   
  }
    bind(gl, clear){
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.depthFramebuffer);
    gl.clearColor(0.0, 0.5, 0.0, 0.0); // Clear to black, fully opaque
    gl.clearDepth(1.0); // Clear everything
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.enable(gl.BLEND); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
 //   gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.FRONT);
    // Clear the canvas before we start drawing on it.
 
    
     if(clear) gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
  }
export { loadTexture ,Framebuffer};