import React, { useState } from "react";
import axios from "axios";
import Login from "./components/Login";
import DynamicForm from "./components/DynamicForm";
import { FormSection } from "./types/formTypes";

const App: React.FC = () => {
  const [rollNumber, setRollNumber] = useState("");
  const [formSections, setFormSections] = useState<FormSection[] | null>(null);
  const [formTitle, setFormTitle] = useState<string>("");

  const handleLogin = async (roll: string, name: string) => {
    try {
      console.log("Sending user:", { roll, name });

      await axios.post(
        "https://dynamic-form-generator-9rl7.onrender.com/create-user",
        {
          rollNumber: roll,
          name,
        }
      );

      console.log("User created. Now fetching form…");

      const response = await axios.get(
        `https://dynamic-form-generator-9rl7.onrender.com/get-form?rollNumber=${roll}`
      );

      console.log("Form response:", response.data);

      const { form } = response.data;
      setRollNumber(roll);
      setFormSections(form.sections);
      setFormTitle(form.formTitle);
    } catch (error) {
      console.error("Login or form fetch failed:", error);
      alert("Failed to login or fetch form. Please try again.");
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>{formTitle || "Student Form App"}</h1>
      {!formSections ? (
        <Login onLogin={handleLogin} />
      ) : (
        <DynamicForm sections={formSections} />
      )}
    </div>
  );
};

export default App;
