import { TaskProvider } from "./common/context/taskcontent";
import { TaskBoard } from "./pages/taskboard";

import "./App.css";

function App() {
  return (
    <TaskProvider>
      <TaskBoard />
    </TaskProvider>
  );
}

export default App;
