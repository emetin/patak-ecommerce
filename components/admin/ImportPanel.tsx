"use client";

import { useRef, useState } from "react";

type ImportPanelProps = {
  title?: string;
  description: string;
  endpoint: string;
  csvHeader: string;
};

export default function ImportPanel({
  title = "Bulk Import",
  description,
  endpoint,
  csvHeader,
}: ImportPanelProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [importFormat, setImportFormat] = useState<"csv" | "json">("csv");
  const [importText, setImportText] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [importLoading, setImportLoading] = useState(false);
  const [importMessage, setImportMessage] = useState("");
  const [importError, setImportError] = useState("");

  async function handleFileChange(file: File | null) {
    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const fileName = file.name.toLowerCase();

      if (fileName.endsWith(".json")) {
        setImportFormat("json");
      } else {
        setImportFormat("csv");
      }

      setSelectedFileName(file.name);
      setImportText(text);
      setImportMessage("");
      setImportError("");
    } catch (error) {
      setImportError(
        error instanceof Error ? error.message : "File could not be read."
      );
    }
  }

  async function handleImport() {
    setImportLoading(true);
    setImportMessage("");
    setImportError("");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          format: importFormat,
          text: importText,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data?.error || "Import failed.");
      }

      const errorText =
        Array.isArray(data.errors) && data.errors.length
          ? ` Errors: ${data.errors.join(" | ")}`
          : "";

      setImportMessage(
        `Import completed. Inserted: ${data.inserted || 0}, Updated: ${
          data.updated || 0
        }.${errorText}`
      );
    } catch (error) {
      setImportError(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    } finally {
      setImportLoading(false);
    }
  }

  return (
    <div style={cardStyle}>
      <div style={sectionTitleWrapStyle}>
        <h2 style={sectionTitleStyle}>{title}</h2>
      </div>

      <p style={panelTextStyle}>{description}</p>

      <div style={{ display: "grid", gap: 16 }}>
        <div>
          <label style={labelStyle}>Format</label>
          <select
            value={importFormat}
            onChange={(e) => setImportFormat(e.target.value as "csv" | "json")}
            style={inputStyle}
          >
            <option value="csv">csv</option>
            <option value="json">json</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>Upload File</label>

          <div style={uploadBoxStyle}>
            <div style={{ display: "grid", gap: 10 }}>
              <div style={uploadTitleStyle}>
                Select a CSV or JSON file from your computer
              </div>

              <div style={uploadSubTextStyle}>
                Shopify, Zoho, or manually prepared files are supported after
                adapting headers to your Patak structure.
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  type="button"
                  style={primaryButtonStyle}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose File
                </button>

                {selectedFileName ? (
                  <span style={fileNameBadgeStyle}>{selectedFileName}</span>
                ) : (
                  <span style={fileNameMutedStyle}>No file selected</span>
                )}
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.json,text/csv,application/json"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              style={{ display: "none" }}
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Import Content</label>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="You can also paste your CSV or JSON content here"
            style={{ ...inputStyle, minHeight: 320, resize: "vertical" }}
          />
        </div>
      </div>

      <div style={buttonRowStyle}>
        <button
          type="button"
          style={primaryButtonStyle}
          onClick={handleImport}
          disabled={importLoading || !importText.trim()}
        >
          {importLoading ? "Importing..." : "Run Import"}
        </button>
      </div>

      <div style={templateBoxStyle}>
        <div style={templateTitleStyle}>CSV Header Template</div>
        <code style={codeStyle}>{csvHeader}</code>
      </div>

      {importMessage ? <div style={successBoxStyle}>{importMessage}</div> : null}
      {importError ? <div style={errorBoxStyle}>{importError}</div> : null}
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #ddd3c5",
  borderRadius: 24,
  padding: 24,
  boxShadow: "0 10px 30px rgba(23,23,23,0.04)",
};

const sectionTitleWrapStyle: React.CSSProperties = {
  marginBottom: 18,
};

const sectionTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 24,
  fontWeight: 800,
};

const panelTextStyle: React.CSSProperties = {
  marginTop: 0,
  marginBottom: 18,
  color: "#6f6559",
  lineHeight: 1.6,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 8,
  fontWeight: 800,
  fontSize: 15,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 52,
  padding: "14px 16px",
  borderRadius: 16,
  border: "1px solid #d9cfbf",
  background: "#fcfbf8",
  outline: "none",
  fontSize: 15,
};

const uploadBoxStyle: React.CSSProperties = {
  border: "1px dashed #cdbfae",
  background: "#fbf8f3",
  borderRadius: 18,
  padding: 18,
};

const uploadTitleStyle: React.CSSProperties = {
  fontWeight: 800,
  fontSize: 15,
};

const uploadSubTextStyle: React.CSSProperties = {
  color: "#6f6559",
  lineHeight: 1.6,
  fontSize: 14,
};

const buttonRowStyle: React.CSSProperties = {
  display: "flex",
  gap: 12,
  marginTop: 24,
  flexWrap: "wrap",
};

const primaryButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 48,
  padding: "0 18px",
  borderRadius: 14,
  border: "1px solid #2f7d62",
  background: "#2f7d62",
  color: "#fff",
  fontWeight: 800,
  cursor: "pointer",
  textDecoration: "none",
};

const fileNameBadgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: 40,
  padding: "0 14px",
  borderRadius: 999,
  background: "#eef5f1",
  border: "1px solid #d5e5dd",
  color: "#245943",
  fontWeight: 700,
  fontSize: 14,
};

const fileNameMutedStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: 40,
  color: "#7c7267",
  fontWeight: 600,
  fontSize: 14,
};

const templateBoxStyle: React.CSSProperties = {
  marginTop: 20,
  padding: 16,
  borderRadius: 16,
  background: "#f7f2eb",
  border: "1px solid #e1d7c9",
};

const templateTitleStyle: React.CSSProperties = {
  fontWeight: 800,
  marginBottom: 8,
};

const codeStyle: React.CSSProperties = {
  display: "block",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  fontSize: 13,
  lineHeight: 1.6,
};

const successBoxStyle: React.CSSProperties = {
  marginTop: 18,
  padding: 14,
  borderRadius: 16,
  background: "#eef8f0",
  border: "1px solid #cfe5d4",
};

const errorBoxStyle: React.CSSProperties = {
  marginTop: 18,
  padding: 14,
  borderRadius: 16,
  background: "#fff1f1",
  border: "1px solid #efc9c9",
  color: "#7a2222",
};