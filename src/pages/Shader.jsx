import { Button, Form, Input, Spin } from "antd";
import TextArea from "antd/es/input/TextArea.js";
import React, { useState, useRef } from "react";
import ShaderRenderer from "./ShaderPage";
import { rotatingCubeShader } from "../assets/sharder_info";

export const Shader = () => {
  const [form] = Form.useForm();
  const [shaderCode, setShaderCode] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);

  const handleGenerateShader = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      const description = values.description;

      const response = await fetch("http://localhost:4000/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: description }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      const shaderContent = JSON.parse(data.choices[0].message.content).code;
      setShaderCode(shaderContent);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center mt-10 mb-20 h-full">
      <div className="w-[80%] flex justify-center">
        {/* Shader Description Section */}
        <div className="w-1/2 flex flex-col p-6 justify-start">
          <span className="text-lg font-semibold mb-10">
            Describe WebGL Shader
          </span>
          <Form layout="vertical" name="basic" autoComplete="off" form={form}>
            <Form.Item
              label="WebGL Shader Description"
              name="description"
              rules={[
                {
                  required: true,
                  message: "Please input description",
                },
              ]}
            >
              <TextArea
                size="large"
                placeholder="A rotating cube with gradient bg"
              />
            </Form.Item>
          </Form>
          <Button
            onClick={handleGenerateShader}
            size="large"
            type="primary"
            className="w-[250px]"
            disabled={loading}
          >
            {loading ? <Spin /> : "Generate WebGL Shader"}
          </Button>
          {error && <p className="text-red-500 mt-3">{error}</p>}
        </div>

        {/* Divider */}
        <div className="border-l border-gray-300 h-[300px]"></div>

        {/* Shader Output Section */}
        <div className="w-1/2 flex flex-col p-6 justify-start">
          <span className="text-lg font-semibold mb-3">Canvas</span>
          {!loading && shaderCode && <div className="h-[300px] w-full">
            <ShaderRenderer shader={shaderCode} />
          </div>}
          

          <span className="text-lg font-semibold mt-10 mb-3">WebGL Code</span>
          <pre className="h-[300px] w-full bg-gray-100 p-2 overflow-auto">
            {shaderCode || "Shader code will appear here..."}
          </pre>
        </div>
      </div>
    </div>
  );
};
