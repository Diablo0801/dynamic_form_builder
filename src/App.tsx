import React, { useState } from "react";
import Login from "./components/Login";
import DynamicForm from "./components/DynamicForm";
import type { FormSection } from "./types/formTypes";
import "./styles.css";

const App: React.FC = () => {
  const [sections, setSections] = useState<FormSection[] | null>(null);

  return (
    <>
      {sections ? (
        <DynamicForm sections={sections} />
      ) : (
        <Login onLoginSuccess={setSections} />
      )}
    </>
  );
};

export default App;
