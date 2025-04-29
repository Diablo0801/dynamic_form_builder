import React, { useState } from "react";
import { createUser, getForm } from "../services/api";
import { FormResponse } from "../types/formTypes";

interface Props {
  onLogin: (rollNumber: string, name: string) => void;
}

const Login: React.FC<Props> = ({ onLogin }) => {
  const [rollNumber, setRollNumber] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      await createUser(rollNumber, name);
      const response = await getForm(rollNumber);
      onLogin(response.form, rollNumber);
    } catch (err) {
      setError("Failed to login or fetch form");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        placeholder="Roll Number"
        value={rollNumber}
        onChange={(e) => setRollNumber(e.target.value)}
      />
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleSubmit}>Login</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Login;
