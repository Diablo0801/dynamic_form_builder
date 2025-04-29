// src/components/Login.tsx
import React, { useState } from "react";
import { createUser, getForm } from "../services/api";
import type { FormSection } from "../types/formTypes";

interface Props {
  onLoginSuccess: (sections: FormSection[]) => void;
}

const Login: React.FC<Props> = ({ onLoginSuccess }) => {
  const [rollNumber, setRollNumber] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    const rn = Number(rollNumber);
    if (isNaN(rn)) {
      setError("Roll Number must be a number");
      return;
    }

    try {
      // 1) Try to register user
      await createUser(rn, name.trim());
    } catch (err: any) {
      console.warn("create-user error:", err.message);
      // If user already exists, ignore and proceed:
      if (!err.message.includes("409")) {
        setError(err.message || "Registration failed");
        return;
      }
    }

    try {
      // 2) Fetch the form regardless
      const { form } = await getForm(rn);
      onLoginSuccess(form.sections);
    } catch (err: any) {
      console.error("get-form error:", err);
      setError(err.message || "Failed to fetch form");
    }
  };

  return (
    <div className="container">
      <h2>Student Form App — Login</h2>
      <div className="field">
        <input
          placeholder="Roll Number"
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
        />
      </div>
      <div className="field">
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <button onClick={handleLogin}>Login</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Login;
