#ifdef GL_ES
precision mediump float;
#endif

// below is the line that imports our noise function
//#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

uniform float time;
uniform sampler2D state;
uniform vec2 resolution;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;

  vec4 color = texture2D(state, gl_FragCoord.xy / resolution);

  float x, y;
  x = fract(uv.x*25.0);
  y = fract(uv.y*25.0);

  if(x > 0.9 || y > 0.9){
    gl_FragColor = vec4(1.,1.,1.,1.);
  } else {
    gl_FragColor = vec4( color.r, color.g, color.b, 1. );
  }
}