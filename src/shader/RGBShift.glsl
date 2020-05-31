uniform sampler2D tDiffuse;
uniform float uAmount;
uniform vec2 uMouse;

varying vec2 vUv;

float circle(vec2 uv, vec2 disc_center, float disc_radius, float border_size) {
  float dist = distance(uv, disc_center);
  return smoothstep(disc_radius+border_size, disc_radius-border_size, dist);
}

void main() {
  float c = uAmount * circle(vUv, uMouse, 0., 0.2);

  vec4 cr = texture2D(tDiffuse, (vUv + c));
  vec4 cga = texture2D(tDiffuse, vUv);
  vec4 cb = texture2D(tDiffuse, (vUv - c));

  // zoom effect
  // vec2 warp = mix(vUv, uMouse, c * 5.0);

  gl_FragColor = vec4(cga.r, cr.g, cb.b, cga.a);
  // zoom effect
  // gl_FragColor = texture2D(tDiffuse, warp);
}