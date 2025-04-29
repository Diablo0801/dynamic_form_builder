import React, { useState } from "react";
import Section from "./Section";
import type { FormSection } from "../types/formTypes";

interface Props {
  sections: FormSection[];
}

const DynamicForm: React.FC<Props> = ({ sections }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [submittedData, setSubmittedData] = useState<Record<
    string,
    any
  > | null>(null);

  const isLast = currentIndex === sections.length - 1;

  const handleNext = (valid: boolean) => {
    if (valid && !isLast) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  const handleSubmit = (valid: boolean) => {
    if (!valid) return;
    console.log("Final Form Data:", formData);

    setSubmittedData(formData);
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

      {submittedData && (
        <div className="submitted">
          <h3>Submitted Form Data</h3>
          <pre>{JSON.stringify(submittedData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default DynamicForm;
