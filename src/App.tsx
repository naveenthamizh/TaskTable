import { useEffect } from "react";
import { TaskProvider } from "./common/context/taskcontent";
import { TaskBoard } from "./pages/taskboard";

import "./App.css";

function App() {
  useEffect(() => {
    (function () {
      const pushState = history.pushState;
      const replaceState = history.replaceState;

      history.pushState = function (...args) {
        const result = pushState.apply(history, args);
        window.dispatchEvent(new Event("urlchange"));
        return result;
      };

      history.replaceState = function (...args) {
        const result = replaceState.apply(history, args);
        window.dispatchEvent(new Event("urlchange"));
        return result;
      };

      window.addEventListener("popstate", () => {
        window.dispatchEvent(new Event("urlchange"));
      });
    })();
  }, []);

  return (
    <TaskProvider>
      <TaskBoard />
    </TaskProvider>
  );
}

export default App;
