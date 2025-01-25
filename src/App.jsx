import { useState } from "react";
import { Button, Tabs } from "antd";
import "./App.css";
import { Navbar } from "./components/navbar/Navbar";
import { Calculator } from "./pages/Calculator";
import WebGLCanvas from "./components/webGL/WebGL";
import ShaderRenderer from "./pages/ShaderPage";
import { Shader } from "./pages/Shader";
import { rotatingCubeShader } from "./assets/sharder_info";
// import { rotatingCubeShader } from "./pages/Shader";



function App() {
  const tabs = [
    {
      label: "WASM Calculator",
      key: "1",
      children: <Calculator />,
    },
    {
      label: "Text-to-Shader",
      key: "2",
      children: <Shader />,
    },
  ];

  return (
    <div className="page">
      <Navbar />
      <div className="mt-10">
        <Tabs defaultActiveKey="1" items={tabs} centered className="mt-5" />
      </div>
    </div>
  );
}

export default App;
