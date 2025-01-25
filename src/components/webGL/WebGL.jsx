import React, { useRef, useEffect } from 'react';

const WebGLCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl');

    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    // Vertex Shader
    const vertexShaderSource = `
      precision mediump float;

      attribute vec3 position;
      attribute vec2 uv;

      uniform mat4 modelMatrix;
      uniform mat4 viewMatrix;
      uniform mat4 projectionMatrix;
      uniform float time;

      varying vec2 vUv;

      void main() {
          vUv = uv;

          // Rotate the cube over time
          float angle = time * 0.5;
          mat4 rotationMatrix = mat4(
              cos(angle), 0.0, sin(angle), 0.0,
              0.0, 1.0, 0.0, 0.0,
              -sin(angle), 0.0, cos(angle), 0.0,
              0.0, 0.0, 0.0, 1.0
          );

          gl_Position = projectionMatrix * viewMatrix * modelMatrix * rotationMatrix * vec4(position, 1.0);
      }
    `;

    // Fragment Shader
    const fragmentShaderSource = `
      precision mediump float;

      varying vec2 vUv;

      void main() {
          // Create a vertical gradient
          vec3 gradientColor = mix(vec3(0.2, 0.4, 0.8), vec3(1.0, 0.6, 0.2), vUv.y);
          gl_FragColor = vec4(gradientColor, 1.0);
      }
    `;

    const compileShader = (source, type) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(`Error compiling shader: ${gl.getShaderInfoLog(shader)}`);
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(`Error linking program: ${gl.getProgramInfoLog(program)}`);
      gl.deleteProgram(program);
      return;
    }

    gl.useProgram(program);

    // Define a cube with positions and UVs
    const vertices = new Float32Array([
      // Positions      // UVs
      -1, -1, -1,       0, 0,
       1, -1, -1,       1, 0,
       1,  1, -1,       1, 1,
      -1,  1, -1,       0, 1,
    ]);

    const indices = new Uint16Array([
      0, 1, 2, 0, 2, 3,
    ]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 20, 0);

    const uvLocation = gl.getAttribLocation(program, 'uv');
    gl.enableVertexAttribArray(uvLocation);
    gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 20, 12);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    // Set up uniforms
    const modelMatrixLocation = gl.getUniformLocation(program, 'modelMatrix');
    const viewMatrixLocation = gl.getUniformLocation(program, 'viewMatrix');
    const projectionMatrixLocation = gl.getUniformLocation(program, 'projectionMatrix');
    const timeLocation = gl.getUniformLocation(program, 'time');

    const modelMatrix = mat4.create();
    const viewMatrix = mat4.create();
    const projectionMatrix = mat4.create();

    mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 0.1, 100.0);
    mat4.lookAt(viewMatrix, [0, 0, 5], [0, 0, 0], [0, 1, 0]);

    gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix);
    gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
    gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);

    let time = 0;

    const render = () => {
      time += 0.01;
      gl.uniform1f(timeLocation, time);

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

      requestAnimationFrame(render);
    };

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    render();
  }, []);

  return <canvas ref={canvasRef} width={800} height={600} />;
};

export default WebGLCanvas;
    