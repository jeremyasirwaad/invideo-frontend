"use client";

import React, { useState } from "react";

export const Navbar = () => {
  

  return (
    <div className="border-b-[0.75px] border-gray-400">
      <div className="w-full flex flex-col items-center">
        <div className="flex py-8 px-20 w-full items-center justify-between">
          <h3 className="font-semibold text-3xl">Invideo Interview</h3>
          <h3 className="font-semibold text-3xl text-[#1772d2]">
            Jeremy Asirwaad
          </h3>
        </div>
      </div>
    </div>
  );
};
