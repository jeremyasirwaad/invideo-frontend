

// Example Shader Strings

// 1. Rotating Cube Shader
export const rotatingCubeShader = `
#vertex
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

#fragment
uniform float u_time;
varying vec2 vUv;

void main() {
  vec2 center = vec2(0.5, 0.5);
  vec2 uv = vUv - center;

  // Create a rotating effect
  float angle = u_time * 1.0; // Adjust rotation speed
  mat2 rotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
  uv = rotation * uv;

  // Circle mask
  float radius = 0.4;
  float dist = length(uv);
  float mask = smoothstep(radius, radius - 0.01, dist);

  // Color the circle
  vec3 color = mix(vec3(1.0, 0.5, 0.0), vec3(0.0, 0.0, 1.0), dist / radius);
  gl_FragColor = vec4(color * mask, 1.0);
}
`;

// 2. Custom Shader Example (e.g., Procedural Gradient)
export const gradientShader = `
#vertex
uniform float u_time;
attribute vec3 position;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

#fragment
uniform float u_time;

void main() {
  // Create a dynamic color gradient
  vec2 uv = gl_FragCoord.xy / vec2(800.0, 600.0); // Assuming canvas size
  vec3 color = vec3(uv, 0.5 + 0.5 * sin(u_time));
  gl_FragColor = vec4(color, 1.0);
}
`;



