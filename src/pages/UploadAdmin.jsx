import { useState } from "react";
import { upload } from "@vercel/blob/client";
import { SEO } from "../components/SEO";
import { P } from "../data/palette";

export const UploadAdmin = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [category, setCategory] = useState("design");

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);
    const results = [];

    for (const file of files) {
      try {
        console.log("[v0] Uploading:", file.name, "Size:", file.size);
        
        // Direct client-side upload to Blob (bypasses serverless function size limits)
        const blob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
        });

        console.log("[v0] Upload successful:", blob.url);

        results.push({
          filename: file.name,
          url: blob.url,
          success: true,
        });
      } catch (error) {
        console.error("[v0] Upload error:", error);
        results.push({
          filename: file.name,
          error: error.message,
          success: false,
        });
      }
    }

    setUploadedUrls([...uploadedUrls, ...results]);
    setUploading(false);
    setFiles([]);
  };

  const generateCode = () => {
    const successful = uploadedUrls.filter(u => u.success);
    if (successful.length === 0) return "";

    const items = successful.map(u => {
      const cleanName = u.filename.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      return `  { title: "${cleanName}", img: "${u.url}", desc: "Description here" }`;
    }).join(",\n");

    return `// Add to src/data/portfolio.js in the ${category.toUpperCase()}_PROJECTS array:\n[\n${items}\n]`;
  };

  return (
    <div style={{ background: P.bg, color: P.text, minHeight: "100vh", padding: "40px 20px" }}>
      <SEO 
        title="Upload Admin - Portfolio Images"
        description="Upload images to Vercel Blob"
      />

      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <h1 style={{ color: P.cyan, marginBottom: "30px", fontSize: "2rem" }}>Portfolio Image Upload</h1>

        <div style={{ background: P.cardBg, padding: "30px", borderRadius: "8px", border: `1px solid ${P.cyan}40`, marginBottom: "30px" }}>
          <label style={{ display: "block", marginBottom: "20px" }}>
            <span style={{ display: "block", marginBottom: "10px", color: P.cyan }}>Category:</span>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              style={{ 
                background: P.bg, 
                color: P.text, 
                border: `1px solid ${P.cyan}`,
                padding: "10px",
                borderRadius: "4px",
                width: "100%",
                fontSize: "1rem"
              }}
            >
              <option value="design">Design</option>
              <option value="photography">Photography</option>
              <option value="ai">AI × Human</option>
              <option value="motion">Motion</option>
            </select>
          </label>

          <label style={{ display: "block", marginBottom: "20px" }}>
            <span style={{ display: "block", marginBottom: "10px", color: P.cyan }}>
              Select Images (multiple):
            </span>
            <input 
              type="file" 
              multiple 
              accept="image/*"
              onChange={handleFileChange}
              style={{ 
                background: P.bg, 
                color: P.text, 
                padding: "10px",
                border: `1px solid ${P.cyan}`,
                borderRadius: "4px",
                width: "100%"
              }}
            />
          </label>

          {files.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <p style={{ color: P.cyan, marginBottom: "10px" }}>
                {files.length} file(s) selected
              </p>
              <div style={{ maxHeight: "150px", overflow: "auto", fontSize: "0.9rem" }}>
                {files.map((f, i) => (
                  <div key={i} style={{ padding: "5px 0", opacity: 0.7 }}>
                    {f.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={uploadFiles}
            disabled={uploading || files.length === 0}
            style={{
              background: uploading ? P.textDim : P.cyan,
              color: P.bg,
              padding: "12px 30px",
              border: "none",
              borderRadius: "4px",
              cursor: uploading || files.length === 0 ? "not-allowed" : "pointer",
              fontSize: "1rem",
              fontWeight: "600",
              width: "100%"
            }}
          >
            {uploading ? "Uploading..." : `Upload ${files.length} file(s)`}
          </button>
        </div>

        {uploadedUrls.length > 0 && (
          <>
            <div style={{ background: P.cardBg, padding: "30px", borderRadius: "8px", border: `1px solid ${P.green}40`, marginBottom: "20px" }}>
              <h2 style={{ color: P.green, marginBottom: "20px", fontSize: "1.5rem" }}>Upload Results</h2>
              <div style={{ maxHeight: "300px", overflow: "auto" }}>
                {uploadedUrls.map((result, i) => (
                  <div 
                    key={i} 
                    style={{ 
                      padding: "10px", 
                      marginBottom: "10px",
                      background: result.success ? `${P.green}20` : `${P.magenta}20`,
                      borderRadius: "4px",
                      fontSize: "0.9rem"
                    }}
                  >
                    <div style={{ color: result.success ? P.green : P.magenta, fontWeight: "600" }}>
                      {result.filename}
                    </div>
                    {result.success ? (
                      <div style={{ opacity: 0.7, wordBreak: "break-all", marginTop: "5px" }}>
                        {result.url}
                      </div>
                    ) : (
                      <div style={{ color: P.magenta, marginTop: "5px" }}>
                        Error: {result.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: P.cardBg, padding: "30px", borderRadius: "8px", border: `1px solid ${P.cyan}40` }}>
              <h2 style={{ color: P.cyan, marginBottom: "15px", fontSize: "1.5rem" }}>Generated Code</h2>
              <p style={{ opacity: 0.7, marginBottom: "15px", fontSize: "0.9rem" }}>
                Copy this code and paste it into your portfolio data file:
              </p>
              <pre style={{ 
                background: P.bg, 
                padding: "20px", 
                borderRadius: "4px",
                overflow: "auto",
                fontSize: "0.85rem",
                border: `1px solid ${P.cyan}40`
              }}>
                <code>{generateCode()}</code>
              </pre>
              <button
                onClick={() => navigator.clipboard.writeText(generateCode())}
                style={{
                  background: P.cyan,
                  color: P.bg,
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  marginTop: "15px"
                }}
              >
                Copy to Clipboard
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
