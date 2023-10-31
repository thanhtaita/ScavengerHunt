import "./ProcessBar.css";
import { BiQrScan } from "react-icons/bi";
import { BsClipboardDataFill } from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6";

const ProcessBar = ({ step }) => {
  // const handleStepClick = (stepIndex) => {
  //   setStep(stepIndex);
  // };

  return (
    <div className="row">
      <div className="cont">
        <progress id="nprogress-bar" value={step * 50} max="100"></progress>
        <div id="step">
          <span className={`first ${step >= 0 ? "border-change" : ""}`}>
            <BsClipboardDataFill
              size={20}
              color={`${step >= 0 ? "black" : "fff"}`}
            />
          </span>
          <span className={`second ${step >= 1 ? "border-change" : "#d0d0d0"}`}>
            <BiQrScan size={20} color={`${step >= 1 ? "black" : "fff"}`} />
          </span>
          <span className={`third ${step >= 2 ? "border-change" : ""}`}>
            <FaLocationDot size={20} color={`${step >= 2 ? "black" : "fff"}`} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProcessBar;
