import "./ProcessBar.css";
import { useState } from "react";

const ProcessBar = () => {
  const [step, setStep] = useState(0);

  const handleStepClick = (stepIndex) => {
    setStep(stepIndex);
  };

  return (
    <div className="row">
      <div className="cont">
        <progress id="nprogress-bar" value={step * 34} max="100"></progress>
        <div id="step">
          <span
            className={`first ${step === 0 ? "border-change" : ""}`}
            onClick={() => handleStepClick(0)}
          >
            <i className="fa fa-flask"></i>
          </span>
          <span
            className={`second ${step === 1 ? "border-change" : ""}`}
            onClick={() => handleStepClick(1)}
          >
            <i className="fa fa-paint-brush"></i>
          </span>
          <span
            className={`third ${step === 2 ? "border-change" : ""}`}
            onClick={() => handleStepClick(2)}
          >
            <i className="fa fa-code"></i>
          </span>
          <span
            className={`fourth ${step === 3 ? "border-change" : ""}`}
            onClick={() => handleStepClick(3)}
          >
            <i className="fa fa-rocket"></i>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProcessBar;
