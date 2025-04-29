import React, { useState } from "react";
import type { FormSection } from "../types/formTypes";
import Section from "./Section";

interface Props {
  sections: FormSection[];
}

const DynamicForm: React.FC<Props> = ({ sections }) => {
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
      alert("Check console for final form data");
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
        onNext={handleNext}
        onPrev={handlePrev}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default DynamicForm;
