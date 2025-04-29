// src/components/DynamicForm.tsx
import React, { useState } from "react";
import Section from "./Section";
import type { FormSection } from "../types/formTypes";

interface Props {
  sections: FormSection[];
}

export default function DynamicForm({ sections }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isLast = currentIndex === sections.length - 1;

  const handleNext = (valid: boolean) => {
    if (valid && !isLast) setCurrentIndex((i) => i + 1);
  };
  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };
  const handleSubmit = (valid: boolean) => {
    if (valid) {
      console.log("Final Form Data:", formData);
      alert("Form submitted! Check console.");
    }
  };

  return (
    <div className="container">
      <h2>{sections[currentIndex].title}</h2>
      <Section
        section={sections[currentIndex]}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
        isLast={isLast}
        onNext={handleNext}
        onPrev={handlePrev}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
