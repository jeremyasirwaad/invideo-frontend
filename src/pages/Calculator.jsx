import { Button, Checkbox, Form, Input } from "antd";
import TextArea from "antd/es/input/TextArea.js";
import React, { useState, useEffect } from "react";

export const Calculator = () => {
  const [form] = Form.useForm();
  const [wasmModule, setWasmModule] = useState(null);
  const [expression_output, setexpression_output] = useState(null);

  useEffect(() => {
    const loadWasm = async () => {
      try {
        const module = await import("../../wasm/calculator/pkg/calculator.js");
        await module.default();
        setWasmModule(module);
      } catch (error) {
        console.error("Error loading WASM module:", error);
      }
    };

    loadWasm();
  }, []);

  const calculate_expression = async () => {
    try {
      const values = await form.validateFields();
      if (wasmModule) {
        const result = wasmModule.calculate(values.expression);
        setexpression_output(result);
      } else {
        console.error("WASM module is not loaded");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full mt-10 flex flex-col items-center justify-center">
      <div className="max-w-[400px] w-[90vw]">
        <Form
          layout="vertical"
          name="basic"
          autoComplete="off"
          className="w-full"
          form={form}
        >
          <Form.Item
            label="Mathematical expression"
            name="expression"
            rules={[
              {
                required: true,
                message: "Please input math expression for calculation",
              },
            ]}
          >
            <Input
              size="large"
              onPressEnter={calculate_expression}
              placeholder="(e.g., 2+2, 3*4, (5+7)/2)"
            />
          </Form.Item>
        </Form>
        <Button
          onClick={calculate_expression}
          className="w-full"
          size="large"
          type="primary"
        >
          Calculate expression
        </Button>
        <div className="mt-10 w-full flex items-center justify-center">
          {expression_output != "Error" ? (
            <span className="text-center text-[65px]">
              {expression_output}
            </span>
          ) : (
            <span className="text-center text-[35px]">
              Incorrect expression provided
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
