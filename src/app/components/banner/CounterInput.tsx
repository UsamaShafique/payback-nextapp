"use client";

import React from "react";
import { MinusIcon, PlusIcon } from "./Icons";
import { MAX_QUANTITY_PER_PHASE, Phase, PHASES } from "@/app/constants";

interface CounterInputProps {
  value: number | "";
  onChange: (val: number | "") => void;
  phase: Phase;
}

const CounterInput: React.FC<CounterInputProps> = ({
  value,
  onChange,
  phase,
}) => {
  const min = 1;
  const max = MAX_QUANTITY_PER_PHASE[phase];
  const isPublic = phase === PHASES.PUBLIC;

  const clamp = (val: number) => Math.min(Math.max(val, min), max);
  const safeValue = value === "" ? min : value;

  const decrease = () => {
    if (isPublic) onChange(clamp(safeValue - 1));
  };

  const increase = () => {
    if (isPublic) onChange(clamp(safeValue + 1));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isPublic) return;
    const num = parseInt(e.target.value, 10);
    if (!isNaN(num)) {
      onChange(clamp(num));
    } else {
      onChange(min);
    }
  };

  return (
    <div className="maininput">
      {isPublic && (
        <button className="signbutton" onClick={decrease}>
          <MinusIcon />
        </button>
      )}

      <input
        type="number"
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        readOnly={!isPublic}
        className="numberinput"
      />

      {isPublic && (
        <button className="signbutton" onClick={increase}>
          <PlusIcon />
        </button>
      )}
    </div>
  );
};

export default CounterInput;
