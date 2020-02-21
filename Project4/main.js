const glslify = require( 'glslify' )
const toy     = require( 'gl-toy' )
const fbo     = require( 'gl-fbo' )
const createShader = require('gl-shader')
const getPixels = require('gl-texture2d-pixels')

const frag = glslify( './frag.glsl' ), vert = glslify( './vert.glsl' ), draw = glslify('./draw.glsl')


let initialized = false, height, width, cellH, cellW, sim = null, grid

const state = []


let action = 1, ant = [], nextDir = [], nextColor = []

//Set color of current cell based on the current color and then set the direction to move in
function setDirection(dir, isWhite){
    if(isWhite){
        switch (dir) {
            case "up":
                nextDir[0] = "right"
                nextColor[0] = 0
                break;
            case "down":
                nextDir[0] = "left"
                nextColor[0] = 0
                break;
            case "left":
                nextDir[0] = "up"
                nextColor[0] = 0
                break;
            case "right":
                nextDir[0] = "down"
                nextColor[0] = 0
                break;
        }
    }else{
        switch (dir) {
            case "up":
                nextDir[0] = "left"
                nextColor[0] = 255
                break;
            case "down":
                nextDir[0] = "right"
                nextColor[0] = 255
                break;
            case "left":
                nextDir[0] = "down"
                nextColor[0] = 255
                break;
            case "right":
                nextDir[0] = "up"
                nextColor[0] = 255
                break;
        }
    }

}

//gives the new position of the ant
function nextPosition(dir, gl){
    val = nextColor[0]
    switch(dir){
        case "up":
            console.log("moving up")
            //check color of next cell
            nextY = ant[Math.floor(ant.length/2)][1] += cellH
            next = getPixels(state[0].color[0])[4 * ( nextY * gl.drawingBufferWidth + ant[Math.floor(ant.length/2)][0])]
            console.log(next)
            setDirection(dir, (next > 0))

            for(i = 0; i < ant.length; i++){
                ant[i][1] += cellH
                poke(ant[i][0], ant[i][1], val, state[0].color[0])
            }

            break;

        case "down":
            console.log("moving down")
            //check color of next cell
            nextY = ant[Math.floor(ant.length/2)][1] -= cellH
            next = getPixels(state[0].color[0])[4 * ( nextY * gl.drawingBufferWidth + ant[Math.floor(ant.length/2)][0])]
            console.log(next)
            setDirection(dir, (next > 0))

            for(i = 0; i < ant.length; i++){
                ant[i][1] -= cellH
                poke(ant[i][0], ant[i][1], val, state[0].color[0])
            }

            break;

        case "left":
            console.log("moving left")
            //check color of next cell
            nextX = ant[Math.floor(ant.length/2)][0] -= cellW
            next = getPixels(state[0].color[0])[4 * ( ant[Math.floor(ant.length/2)][1] * gl.drawingBufferWidth + nextX)]
            console.log(next)
            setDirection(dir, (next > 0))

            for(i = 0; i < ant.length; i++){
                ant[i][0] -= cellW
                poke(ant[i][0], ant[i][1], val, state[0].color[0])
            }

            break;

        case "right":
            console.log("moving right")
            //check color of next cell
            nextX = ant[Math.floor(ant.length/2)][0] -= cellW
            next = getPixels(state[0].color[0])[4 * ( ant[Math.floor(ant.length/2)][1] * gl.drawingBufferWidth + nextX)]
            console.log(next)
            setDirection(dir, (next > 0))

            for(i = 0; i < ant.length; i++){
                ant[i][0] += cellW
                poke(ant[i][0], ant[i][1], val, state[0].color[0])
            }

            break;
    }

}

//move the ant
function moveAnt(gl){
    switch (action) {
        case 0:
            break;
        case 1:
            nextPosition(nextDir[0], gl)
            break;
    }
}

//
function poke( x, y, value, texture ) {
    const gl = texture.gl
    texture.bind()

    gl.texSubImage2D(
        gl.TEXTURE_2D, 0,
        x, y, 1, 1,
        gl.RGBA, gl.UNSIGNED_BYTE,
        new Uint8Array([ value,value,value, 255 ])
    )
}

//Place ant


//int grid set up
function intAnt(h, w, size, tex) {
    //set ant at mid; need to get mid of size
        for( i = 0; i < w; i++ ) {
            for( j = 0; j < h; j++ ) {
                if( ((Math.ceil(size/2)/size) > i/w && i/w > (Math.floor(size/2)/size)) && ((Math.ceil(size/2)/size) > j/h && j/h > (Math.floor(size/2)/size))) {
                    ant.push([i,j])
                    poke( i, j, 255, tex )
                }
            }
        }
        nextDir.push("left")
    nextColor.push(255)
}

//
function int(gl, size){
    //create the grid
    height = gl.drawingBufferHeight
    width = gl.drawingBufferWidth

    state[0] = fbo( gl, [width,height] )
    state[1] = fbo( gl, [width,height] )

    cellH = Math.round(height/size)
    cellW = Math.round(width/size)

    intAnt(height, width, size, state[0].color[0])

    sim = createShader(gl, vert, draw)

    initialized = true
}

let current = 0
function tick(gl){
    preState = state[current]
    curState = state[current ^= 1]
    console.log(gl.canvas)

    moveAnt(gl)

    curState.bind()
    sim.bind()

    sim.uniforms.resolution = [ gl.drawingBufferWidth, gl.drawingBufferHeight ]
    sim.uniforms.state = preState.color[0].bind()

    //sim.attribute.a_position.location = 0
}

let count = 0
toy( draw, (gl, shader) => {
    // this function runs once per frame
    if(!initialized){
        int(gl, 25)
    }
    tick(gl)

    shader.bind()

    // restore default framebuffer binding after overriding in tick
    gl.bindFramebuffer( gl.FRAMEBUFFER, null )

    shader.uniforms.resolution = [ gl.drawingBufferWidth, gl.drawingBufferHeight ]
    shader.uniforms.uSampler = state[ 0 ].color[0].bind()
    shader.uniforms.time = count++
})