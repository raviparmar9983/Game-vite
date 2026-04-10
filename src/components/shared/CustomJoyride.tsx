import React from "react";
import  {Joyride, STATUS } from "react-joyride";
import type { Step } from "react-joyride";
// @ts-ignore
interface CustomJoyrideProps {
  steps: Step[];
  run: boolean;
  onComplete: () => void;
}

const CustomJoyride: React.FC<CustomJoyrideProps> = ({
  steps,
  run,
  onComplete,
}) => {
  const JoyrideComponent = Joyride as any;

  const handleJoyrideCallback = (data: { status?: string }) => {
    const { status } = data;

    if (
      status === STATUS.FINISHED ||
      status === STATUS.SKIPPED
    ) {
      onComplete();
    }
  };

  return (
    <JoyrideComponent
      callback={handleJoyrideCallback}
      continuous
      run={run}
      scrollToFirstStep
      showProgress
      showSkipButton
      steps={steps}
      // @ts-ignore
      styles={{
        options: {
          arrowColor: "rgba(20, 20, 30, 0.9)",
          backgroundColor: "rgba(20, 20, 30, 0.9)",
          overlayColor: "rgba(0, 0, 0, 0.7)",
          primaryColor: "#00ccff",
          textColor: "#ffffff",
          zIndex: 10000,
        },
        tooltipContainer: {
          textAlign: "left",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(0, 204, 255, 0.3)",
          borderRadius: "12px",
          boxShadow: "0 0 20px rgba(0, 204, 255, 0.15)",
        },
        tooltipTitle: {
          color: "#00ff88",
          fontWeight: 700,
          marginBottom: 10,
        },
        tooltipContent: {
          padding: "10px 0",
          color: "#e0e0e0",
          lineHeight: 1.5,
        },
        buttonNext: {
          backgroundColor: "#00ccff",
          color: "#000",
          fontWeight: "bold",
          borderRadius: 8,
          padding: "8px 16px",
        },
        buttonBack: {
          color: "#b0b0b0",
        },
        buttonSkip: {
          color: "#b0b0b0",
        },
      }}
    />
  );
};

export default CustomJoyride;
