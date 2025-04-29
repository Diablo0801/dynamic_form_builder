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
  const validate = () => {
    const newErrors: Record<string, string> = {};
    for (const f of section.fields) {
      const val = formData[f.fieldId];
      if (f.required && !val) {
        newErrors[f.fieldId] = "This field is required";
      } else if (
        f.minLength &&
        typeof val === "string" &&
        val.length < f.minLength
      ) {
        newErrors[f.fieldId] =
          f.validation?.message || `Must be at least ${f.minLength} chars`;
      } else if (
        f.maxLength &&
        typeof val === "string" &&
        val.length > f.maxLength
      ) {
        newErrors[f.fieldId] =
          f.validation?.message || `Must be at most ${f.maxLength} chars`;
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (fieldId: string, value: any) => {
    setFormData((d) => ({ ...d, [fieldId]: value }));
  };

  return (
    <div className="section">
      <h3>{section.title}</h3>
      <p>{section.description}</p>

      {section.fields.map((f) => (
        <div className="field" key={f.fieldId}>
          <label>{f.label}</label>
          {f.type === "textarea" ? (
            <textarea
              placeholder={f.placeholder}
              value={formData[f.fieldId] || ""}
              onChange={(e) => handleChange(f.fieldId, e.target.value)}
            />
          ) : f.type === "dropdown" ? (
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
          ) : f.type === "radio" ? (
            f.options?.map((o) => (
              <label key={o.value}>
                <input
                  type="radio"
                  name={f.fieldId}
                  value={o.value}
                  checked={formData[f.fieldId] === o.value}
                  onChange={() => handleChange(f.fieldId, o.value)}
                />
                {o.label}
              </label>
            ))
          ) : f.type === "checkbox" ? (
            f.options?.map((o) => {
              const arr: string[] = formData[f.fieldId] || [];
              return (
                <label key={o.value}>
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
                  {o.label}
                </label>
              );
            })
          ) : (
            <input
              type={f.type}
              placeholder={f.placeholder}
              value={formData[f.fieldId] || ""}
              onChange={(e) => handleChange(f.fieldId, e.target.value)}
            />
          )}
          {errors[f.fieldId] && (
            <small className="error">{errors[f.fieldId]}</small>
          )}
        </div>
      ))}

      <div className="buttons">
        <button onClick={() => onPrev()}>Prev</button>
        {section.sectionId <
        // last section?
        // since sectionId is numeric but index-based in parent,
        // you may need to pass an isLast prop instead.
        Number.MAX_VALUE ? ( // we'll handle Submit in parent
          <button onClick={() => onNext(validate())}>Next</button>
        ) : (
          <button onClick={() => onSubmit(validate())}>Submit</button>
        )}
      </div>
    </div>
  );
};

export default Section;
