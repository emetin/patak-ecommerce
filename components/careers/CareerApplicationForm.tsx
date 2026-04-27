"use client";

import { useState } from "react";
import { careerPositions } from "../../lib/career-positions";

type CareerApplicationFormProps = {
  positionTitle?: string;
};

type FormState = "idle" | "loading" | "success" | "error";

export default function CareerApplicationForm({
  positionTitle = "",
}: CareerApplicationFormProps) {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    formData.set("source", "career_page");

    setState("loading");
    setMessage("");

    try {
      const response = await fetch("/api/career-application", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Application could not be submitted.");
      }

      setState("success");
      setMessage("Your application has been submitted successfully.");
      form.reset();
    } catch (error) {
      setState("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Application could not be submitted."
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <div style={formHeaderStyle}>
        <div style={kickerStyle}>Apply Now</div>
        <h2 style={titleStyle}>Submit your application</h2>
        <p style={textStyle}>
          Complete the form below and our team will review your application.
        </p>
        <p style={noteStyle}>
          If the position you are interested in is not currently open, please
          select “Other” from the position dropdown and submit your resume for
          future opportunities.
        </p>
      </div>

      <label style={labelStyle}>
        Position *
        <select
          name="position"
          required
          defaultValue={positionTitle || ""}
          style={inputStyle}
        >
          <option value="" disabled>
            Select a position
          </option>

          {careerPositions.map((position) => (
            <option key={position.slug} value={position.title}>
              {position.title}
            </option>
          ))}

          <option value="Other">Other</option>
        </select>
      </label>

      <div className="career-form-grid">
        <label style={labelStyle}>
          Full Name *
          <input name="fullName" required style={inputStyle} />
        </label>

        <label style={labelStyle}>
          Email *
          <input name="email" type="email" required style={inputStyle} />
        </label>

        <label style={labelStyle}>
          Phone *
          <input name="phone" required style={inputStyle} />
        </label>

        <label style={labelStyle}>
          Location
          <input name="location" style={inputStyle} />
        </label>

        <label style={labelStyle}>
          LinkedIn URL
          <input name="linkedinUrl" type="url" style={inputStyle} />
        </label>

        <label style={labelStyle}>
          Portfolio / Website URL
          <input name="portfolioUrl" type="url" style={inputStyle} />
        </label>
      </div>

      <label style={labelStyle}>
        Resume File *
        <input
          name="resumeFile"
          type="file"
          required
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          style={fileInputStyle}
        />
        <span style={helperTextStyle}>
          Accepted file types: PDF, DOC, DOCX. Maximum file size: 5 MB.
        </span>
      </label>

      <label style={labelStyle}>
        Cover Note
        <textarea name="coverNote" rows={5} style={textareaStyle} />
      </label>

      <button type="submit" disabled={state === "loading"} style={buttonStyle}>
        {state === "loading" ? "Submitting..." : "Submit Application"}
      </button>

      {message ? (
        <p
          style={{
            ...messageStyle,
            color: state === "success" ? "#2f7d62" : "#b42318",
          }}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}

const formStyle: React.CSSProperties = {
  width: "100%",
  background: "#ffffff",
  border: "1px solid #e6ddd0",
  borderRadius: 28,
  padding: 28,
  boxShadow: "0 18px 45px rgba(23,23,23,0.06)",
};

const formHeaderStyle: React.CSSProperties = {
  marginBottom: 22,
};

const kickerStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 900,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#2f7d62",
  marginBottom: 8,
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "clamp(1.7rem, 2.4vw, 2.4rem)",
  lineHeight: 1.1,
  color: "#171717",
};

const textStyle: React.CSSProperties = {
  margin: "10px 0 0",
  color: "#5a5349",
  fontSize: 15,
  lineHeight: 1.75,
};

const noteStyle: React.CSSProperties = {
  margin: "14px 0 0",
  padding: "12px 14px",
  borderRadius: 16,
  background: "#edf5f1",
  color: "#245845",
  fontSize: 14,
  lineHeight: 1.7,
  fontWeight: 700,
};

const labelStyle: React.CSSProperties = {
  display: "grid",
  gap: 8,
  marginBottom: 16,
  color: "#171717",
  fontSize: 14,
  fontWeight: 800,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  minWidth: 0,
  border: "1px solid #d8cfc2",
  borderRadius: 14,
  padding: "13px 14px",
  fontSize: 15,
  outline: "none",
  background: "#ffffff",
};

const fileInputStyle: React.CSSProperties = {
  width: "100%",
  minWidth: 0,
  border: "1px dashed #b9ad9e",
  borderRadius: 16,
  padding: "16px",
  fontSize: 14,
  background: "#faf7f1",
  cursor: "pointer",
};

const helperTextStyle: React.CSSProperties = {
  color: "#7a7064",
  fontSize: 12,
  lineHeight: 1.5,
  fontWeight: 600,
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: "vertical",
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #2f7d62",
  borderRadius: 999,
  padding: "14px 22px",
  background: "#2f7d62",
  color: "#ffffff",
  fontSize: 15,
  fontWeight: 900,
  cursor: "pointer",
};

const messageStyle: React.CSSProperties = {
  margin: "14px 0 0",
  fontSize: 14,
  fontWeight: 800,
};