// ShaderRenderer.js
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ShaderMaterial, PlaneGeometry, MeshBasicMaterial } from 'three';
import { extend } from '@react-three/fiber';
import PropTypes from 'prop-types';

// Extend will make the shader material available as a JSX element
extend({ ShaderMaterial });

const ShaderMesh = ({ shader }) => {
  const meshRef = useRef();

  // Split the combined shader into vertex and fragment shaders
  const [vertexShader, fragmentShader] = useMemo(() => {
    const [vShader, fShader] = shader.split('#fragment');
    return [vShader.replace('#vertex', '').trim(), fShader.trim()];
  }, [shader]);

  // Create the shader material
  const shaderMaterial = useMemo(() => {
    return new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        u_time: { value: 0.0 },
        // Add more uniforms here if needed
      },
      // If you need to enable lighting or other features, set the appropriate flags
      // lights: true,
    });
  }, [vertexShader, fragmentShader]);

  // Update the uniform 'u_time' on each frame
  useFrame((state, delta) => {
    shaderMaterial.uniforms.u_time.value += delta;
  });

  return (
    <mesh ref={meshRef} material={shaderMaterial}>
      {/* Default Geometry: Plane */}
      {/* You can change this to other geometries like boxGeometry, sphereGeometry, etc. */}
      <planeGeometry args={[2, 2, 1, 1]} />
    </mesh>
  );
};

ShaderMesh.propTypes = {
  shader: PropTypes.string.isRequired,
};

const ShaderRenderer = ({ shader }) => {
  return (
    <Canvas style={{ height: '100%', width: '100%' }}>
      <ShaderMesh shader={shader} />
    </Canvas>
  );
};

ShaderRenderer.propTypes = {
  shader: PropTypes.string.isRequired,
};

export default ShaderRenderer;
