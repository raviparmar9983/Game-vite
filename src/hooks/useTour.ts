import { useState, useEffect } from "react";

export const useTour = (tourName: string) => {
  const [runTour, setRunTour] = useState(false);

  useEffect(() => {
    // Determine if the player has seen this specific walkthrough
    const hasSeen = localStorage.getItem(`tour_${tourName}`);
    
    // We run the tour only if they haven't seen it
    if (!hasSeen) {
      // Delay slightly to ensure UI finishes mounting animations
      const timer = setTimeout(() => {
        setRunTour(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [tourName]);

  const handleTourComplete = () => {
    localStorage.setItem(`tour_${tourName}`, "true");
    setRunTour(false);
    // TODO: Connect this to the backend once the 'hasCompletedTour' field is available
    // e.g. await axios.patch("/api/user/tour", { completed: true });
  };

  return { runTour, handleTourComplete };
};
