import React, { useState, useEffect } from "react";
import { FormSection, FormField } from "../types/formTypes";

interface Props {
  section: FormSection;
  formData: { [key: string]: any };
  setFormData: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
  onNext: (valid: boolean) => void;
  onPrev: () => void;
  onSubmit: (valid: boolean) => void;
  isLast: boolean;
}

const Section: React.FC<Props> = ({
  section,
  formData,
  setFormData,
  onNext,
  onPrev,
  onSubmit,
  isLast,
}) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setErrors({});
  }, [section.sectionId]);

  const validateField = (field: FormField, value: any) => {
    if (field.required && !value) {
      return `${field.label} is required`;
    }
    if (field.minLength && value.length < field.minLength) {
      return `${field.label} must be at least ${field.minLength} characters`;
    }
    if (field.maxLength && value.length > field.maxLength) {
      return `${field.label} must be at most ${field.maxLength} characters`;
    }
    return "";
  };

  const handleChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleValidation = () => {
    const newErrors: { [key: string]: string } = {};
    section.fields.forEach((field) => {
      const error = validateField(field, formData[field.fieldId]);
      if (error) {
        newErrors[field.fieldId] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextClick = () => {
    const valid = handleValidation();
    onNext(valid);
  };

  const handleSubmitClick = () => {
    const valid = handleValidation();
    onSubmit(valid);
  };

  const renderField = (field: FormField) => {
    switch (field.type) {
      case "text":
      case "email":
      case "tel":
      case "date":
        return (
          <input
            type={field.type}
            placeholder={field.placeholder}
            value={formData[field.fieldId] || ""}
            onChange={(e) => handleChange(field.fieldId, e.target.value)}
            data-testid={field.dataTestId}
          />
        );
      case "textarea":
        return (
          <textarea
            placeholder={field.placeholder}
            value={formData[field.fieldId] || ""}
            onChange={(e) => handleChange(field.fieldId, e.target.value)}
            data-testid={field.dataTestId}
          />
        );
      case "dropdown":
        return (
          <select
            value={formData[field.fieldId] || ""}
            onChange={(e) => handleChange(field.fieldId, e.target.value)}
            data-testid={field.dataTestId}
          >
            <option value="">Select</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );
      case "radio":
        return (
          <>
            {field.options?.map((opt) => (
              <label key={opt.value}>
                <input
                  type="radio"
                  name={field.fieldId}
                  value={opt.value}
                  checked={formData[field.fieldId] === opt.value}
                  onChange={(e) => handleChange(field.fieldId, e.target.value)}
                  data-testid={opt.dataTestId}
                />
                {opt.label}
              </label>
            ))}
          </>
        );
      case "checkbox":
        return (
          <>
            {field.options?.map((opt) => (
              <label key={opt.value}>
                <input
                  type="checkbox"
                  name={field.fieldId}
                  value={opt.value}
                  checked={
                    formData[field.fieldId]?.includes(opt.value) || false
                  }
                  onChange={(e) => {
                    const valueArray = formData[field.fieldId] || [];
                    if (e.target.checked) {
                      handleChange(field.fieldId, [...valueArray, opt.value]);
                    } else {
                      handleChange(
                        field.fieldId,
                        valueArray.filter((v: string) => v !== opt.value)
                      );
                    }
                  }}
                  data-testid={opt.dataTestId}
                />
                {opt.label}
              </label>
            ))}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {section.fields.map((field) => (
        <div key={field.fieldId} style={{ marginBottom: "16px" }}>
          <label>{field.label}</label>
          {renderField(field)}
          {errors[field.fieldId] && (
            <p style={{ color: "red" }}>{errors[field.fieldId]}</p>
          )}
        </div>
      ))}

      <div style={{ marginTop: "20px" }}>
        {section.sectionId > 0 && <button onClick={onPrev}>Previous</button>}
        {!isLast && <button onClick={handleNextClick}>Next</button>}
        {isLast && <button onClick={handleSubmitClick}>Submit</button>}
      </div>
    </div>
  );
};

export default Section;
