// src/components/Section.tsx
import React from "react";
import type { FormSection, FormField } from "../types/formTypes";

interface Props {
  section: FormSection;
  formData: Record<string, any>;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  onNext: (valid: boolean) => void;
  onPrev: () => void;
  onSubmit: (valid: boolean) => void;
}

const Section: React.FC<Props> = ({
  section,
  formData,
  setFormData,
  errors,
  setErrors,
  onNext,
  onPrev,
  onSubmit,
}) => {
  // Validate all fields in this section
  const validate = () => {
    const newErrors: Record<string, string> = {};
    section.fields.forEach((f) => {
      const val = formData[f.fieldId];
      if (f.required && !val) {
        newErrors[f.fieldId] = "This field is required";
      } else if (
        f.minLength &&
        typeof val === "string" &&
        val.length < f.minLength
      ) {
        newErrors[f.fieldId] =
          f.validation?.message || `Must be at least ${f.minLength} characters`;
      } else if (
        f.maxLength &&
        typeof val === "string" &&
        val.length > f.maxLength
      ) {
        newErrors[f.fieldId] =
          f.validation?.message || `Must be at most ${f.maxLength} characters`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Generic change handler
  const handleChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  return (
    <div className="section">
      <h3>{section.title}</h3>
      <p>{section.description}</p>

      {section.fields.map((f) => {
        // TEXT / TEL / EMAIL / DATE
        if (["text", "tel", "email", "date"].includes(f.type)) {
          return (
            <div className="field" key={f.fieldId}>
              <label>{f.label}</label>
              <input
                type={f.type}
                placeholder={f.placeholder}
                value={formData[f.fieldId] || ""}
                onChange={(e) => handleChange(f.fieldId, e.target.value)}
              />
              {errors[f.fieldId] && (
                <small className="error">{errors[f.fieldId]}</small>
              )}
            </div>
          );
        }

        // TEXTAREA
        if (f.type === "textarea") {
          return (
            <div className="field" key={f.fieldId}>
              <label>{f.label}</label>
              <textarea
                placeholder={f.placeholder}
                value={formData[f.fieldId] || ""}
                onChange={(e) => handleChange(f.fieldId, e.target.value)}
              />
              {errors[f.fieldId] && (
                <small className="error">{errors[f.fieldId]}</small>
              )}
            </div>
          );
        }

        // DROPDOWN
        if (f.type === "dropdown") {
          return (
            <div className="field" key={f.fieldId}>
              <label>{f.label}</label>
              <select
                value={formData[f.fieldId] || ""}
                onChange={(e) => handleChange(f.fieldId, e.target.value)}
              >
                <option value="">— select —</option>
                {f.options?.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              {errors[f.fieldId] && (
                <small className="error">{errors[f.fieldId]}</small>
              )}
            </div>
          );
        }

        // RADIO (with improved alignment)
        if (f.type === "radio") {
          return (
            <div className="field" key={f.fieldId}>
              <label className="field-label">{f.label}</label>
              <div className="options">
                {f.options?.map((o) => (
                  <div className="radio-option" key={o.value}>
                    <input
                      type="radio"
                      name={f.fieldId}
                      value={o.value}
                      checked={formData[f.fieldId] === o.value}
                      onChange={() => handleChange(f.fieldId, o.value)}
                    />
                    <span>{o.label}</span>
                  </div>
                ))}
              </div>
              {errors[f.fieldId] && (
                <small className="error">{errors[f.fieldId]}</small>
              )}
            </div>
          );
        }

        // CHECKBOX
        if (f.type === "checkbox") {
          return (
            <div className="field" key={f.fieldId}>
              <label>{f.label}</label>
              <div className="options">
                {f.options?.map((o) => {
                  const arr: string[] = formData[f.fieldId] || [];
                  return (
                    <div className="radio-option" key={o.value}>
                      <input
                        type="checkbox"
                        value={o.value}
                        checked={arr.includes(o.value)}
                        onChange={(e) => {
                          const next = e.target.checked
                            ? [...arr, o.value]
                            : arr.filter((v) => v !== o.value);
                          handleChange(f.fieldId, next);
                        }}
                      />
                      <span>{o.label}</span>
                    </div>
                  );
                })}
              </div>
              {errors[f.fieldId] && (
                <small className="error">{errors[f.fieldId]}</small>
              )}
            </div>
          );
        }

        return null;
      })}

      {/* Prev / Next / Submit */}
      <div className="buttons">
        <button onClick={() => onPrev()}>Prev</button>
        {section.sectionId < Number.MAX_VALUE ? (
          <button onClick={() => onNext(validate())}>Next</button>
        ) : (
          <button onClick={() => onSubmit(validate())}>Submit</button>
        )}
      </div>
    </div>
  );
};

export default Section;
