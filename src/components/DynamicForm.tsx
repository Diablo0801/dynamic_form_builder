import React, { useState } from "react";
import { FormSection } from "../types/formTypes";
import Section from "./Section";

interface Props {
  sections: FormSection[];
}

const DynamicForm: React.FC<Props> = ({ sections }) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const currentSection = sections[currentSectionIndex];

  const handleNext = (valid: boolean) => {
    if (valid && currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex((i) => i + 1);
    }
  };

  const handlePrev = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex((i) => i - 1);
    }
  };

  const handleSubmit = (valid: boolean) => {
    if (valid) {
      console.log("Final Form Data:", formData);
    }
  };

  return (
    <div>
      <h2>{currentSection.title}</h2>
      <p>{currentSection.description}</p>
      <Section
        section={currentSection}
        formData={formData}
        setFormData={setFormData}
        onNext={handleNext}
        onPrev={handlePrev}
        onSubmit={handleSubmit}
        isLast={currentSectionIndex === sections.length - 1}
      />
    </div>
  );
};

export default DynamicForm;
