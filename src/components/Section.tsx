import React from "react";
import type { FormSection, FormField } from "../types/formTypes";

interface Props {
  section: FormSection;
  formData: Record<string, any>;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  isLast: boolean;
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
  isLast,
  onNext,
  onPrev,
  onSubmit,
}) => {
  const validate = (): boolean => {
    const newErr: Record<string, string> = {};
    section.fields.forEach((f) => {
      const val = formData[f.fieldId];
      if (f.required && (val === undefined || val === "")) {
        newErr[f.fieldId] = "This field is required";
      } else if (
        f.minLength &&
        typeof val === "string" &&
        val.length < f.minLength
      ) {
        newErr[f.fieldId] =
          f.validation?.message || `Must be at least ${f.minLength} characters`;
      } else if (
        f.maxLength &&
        typeof val === "string" &&
        val.length > f.maxLength
      ) {
        newErr[f.fieldId] =
          f.validation?.message || `Must be at most ${f.maxLength} characters`;
      }
    });
    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const handleChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const renderField = (f: FormField) => {
    const commonProps = {
      id: f.fieldId,
      "data-testid": f.dataTestId,
    };

    switch (f.type) {
      case "text":
      case "tel":
      case "email":
      case "date":
        return (
          <div className="field" key={f.fieldId}>
            <label htmlFor={f.fieldId}>{f.label}</label>
            <input
              {...commonProps}
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

      case "textarea":
        return (
          <div className="field" key={f.fieldId}>
            <label htmlFor={f.fieldId}>{f.label}</label>
            <textarea
              {...commonProps}
              placeholder={f.placeholder}
              value={formData[f.fieldId] || ""}
              onChange={(e) => handleChange(f.fieldId, e.target.value)}
            />
            {errors[f.fieldId] && (
              <small className="error">{errors[f.fieldId]}</small>
            )}
          </div>
        );

      case "dropdown":
        return (
          <div className="field" key={f.fieldId}>
            <label htmlFor={f.fieldId}>{f.label}</label>
            <select
              {...commonProps}
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

      case "radio":
        return (
          <div className="field" key={f.fieldId}>
            <label className="field-label">{f.label}</label>
            <div className="options">
              {f.options?.map((o) => (
                <div className="radio-option" key={o.value}>
                  <input
                    {...commonProps}
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

      case "checkbox":
        return (
          <div className="field" key={f.fieldId}>
            <label className="field-label">{f.label}</label>
            <div className="options">
              {f.options?.map((o) => {
                const selected: string[] = formData[f.fieldId] || [];
                return (
                  <div className="radio-option" key={o.value}>
                    <input
                      {...commonProps}
                      type="checkbox"
                      value={o.value}
                      checked={selected.includes(o.value)}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...selected, o.value]
                          : selected.filter((v) => v !== o.value);
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

      default:
        return null;
    }
  };

  return (
    <div className="section">
      <h3>{section.title}</h3>
      <p>{section.description}</p>

      {section.fields.map(renderField)}

      <div className="buttons">
        <button type="button" onClick={onPrev}>
          Prev
        </button>

        {isLast ? (
          <button type="button" onClick={() => onSubmit(validate())}>
            Submit
          </button>
        ) : (
          <button type="button" onClick={() => onNext(validate())}>
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default Section;
