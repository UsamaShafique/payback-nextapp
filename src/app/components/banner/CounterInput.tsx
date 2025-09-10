"use client";
import React, { ChangeEvent } from "react";
import { MinusIcon, PlusIcon } from "./Icons";

interface CounterInputProps {
  value: number | "";
  onChange: (val: number | "") => void;
}

const CounterInput: React.FC<CounterInputProps> = ({ value, onChange }) => {
  const decrease = () => {
    if (typeof value === "number" && value > 1) onChange(value - 1);
  };
  const increase = () => {
    if (typeof value === "number") onChange(value + 1);
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (/^\d*$/.test(newValue)) {
      onChange(newValue === "" ? "" : parseInt(newValue, 10));
    }
  };

  return (
    <div className="maininput">
      <button className="signbutton" onClick={decrease}>
        <MinusIcon />
      </button>
      <input
        value={value}
        onChange={handleChange}
        placeholder="1"
        type="text"
        className="numberinput"
      />
      <button className="signbutton" onClick={increase}>
        <PlusIcon />
      </button>
    </div>
  );
};

export default CounterInput;
