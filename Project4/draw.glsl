#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D uSampler;
uniform vec2 resolution;

void main() {
  //gl_FragColor = vec4( texture2D( uSampler, gl_FragCoord.xy / resolution ).rgb, 1. );
  vec2 uv = gl_FragCoord.xy / resolution;

    vec4 color = texture2D(uSampler, gl_FragCoord.xy / resolution);

    float x, y;
    x = fract(uv.x*25.0);
    y = fract(uv.y*25.0);

    if(x > 0.9 || y > 0.9){
      gl_FragColor = vec4(1.,1.,1.,1.);
    } else {
      gl_FragColor = vec4( color.r, color.g, color.b, 1. );
    }
}