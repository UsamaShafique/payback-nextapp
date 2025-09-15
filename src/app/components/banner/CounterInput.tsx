"use client";

import React, { ChangeEvent } from "react";
import { MinusIcon, PlusIcon } from "./Icons";
import { MAX_QUANTITY_PER_PHASE, PhaseKey } from "@/app/constants";

interface CounterInputProps {
  value: number | "";
  onChange: (val: number | "") => void;
  phase: PhaseKey;
}

const CounterInput: React.FC<CounterInputProps> = ({
  value,
  onChange,
  phase,
}) => {
  const max = MAX_QUANTITY_PER_PHASE[phase];

  const decrease = () => {
    if (typeof value === "number" && value > 1) onChange(value - 1);
  };

  const increase = () => {
    if (typeof value === "number" && value < max) onChange(value + 1);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (/^\d*$/.test(newValue)) {
      const val = newValue === "" ? "" : parseInt(newValue, 10);
      if (val === "" || val <= max) onChange(val);
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
