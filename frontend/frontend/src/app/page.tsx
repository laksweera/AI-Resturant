// "use client";
// import { useState } from "react";
// import styles from "./Home.module.scss";

// export default function Home() {
//   const [file, setFile] = useState<File | null>(null);
//   const [resultUrl, setResultUrl] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const handleUpload = async () => {
//     if (!file) return alert("Please select an image.");
//     setLoading(true);

//     try {
//       const formData = new FormData();
//       formData.append("file", file);

//       const base = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

//       const res = await fetch(`${base}/predict`, {
//         method: "POST",
//         body: formData,
//         mode: "cors",
//       });

//       if (!res.ok) {
//         const text = await res.text();
//         throw new Error(text || `HTTP ${res.status}`);
//       }

//       const blob = await res.blob();
//       if (resultUrl) URL.revokeObjectURL(resultUrl);
//       setResultUrl(URL.createObjectURL(blob));
//     } catch (err: any) {
//       alert("Upload failed: " + (err?.message || err));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.title}>YOLO Inference</h1>

//       <input
//         type="file"
//         accept="image/*"
//         onChange={(e) => setFile(e.target.files?.[0] || null)}
//       />

//       <button
//         onClick={handleUpload}
//         className={styles.uploadButton}
//         disabled={loading || !file}
//       >
//         {loading ? "Processing..." : "Upload & Detect"}
//       </button>

//       {resultUrl && (
//         <div className={styles.result}>
//           <h3>Detection Result</h3>
//           <img src={resultUrl} alt="annotated" />
//         </div>
//       )}
//     </div>
//   );
// }

// 2nd/////////////////////////////////////////////////////////////////////////////////////////////////////
// "use client";

// import { useState } from "react";
// import styles from "./Home.module.scss";

// export default function Home() {
//   const [file, setFile] = useState<File | null>(null);
//   const [resultUrl, setResultUrl] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const handleUpload = async () => {
//     if (!file) return alert("Please select an image.");
//     setLoading(true);

//     try {
//       const formData = new FormData();
//       formData.append("file", file);

//       const base = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

//       const res = await fetch(`${base}/predict`, {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) {
//         const text = await res.text();
//         throw new Error(text || `HTTP ${res.status}`);
//       }

//       const blob = await res.blob();
//       if (resultUrl) URL.revokeObjectURL(resultUrl);
//       setResultUrl(URL.createObjectURL(blob));
//     } catch (err: any) {
//       alert("Upload failed: " + (err?.message || err));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.title}>YOLO Object Detection</h1>
//       <p className={styles.subtitle}>
//         Upload an image and detect objects with YOLO in real-time.
//       </p>

//       <div className={styles.uploadWrapper}>
//         <input
//           type="file"
//           accept="image/*"
//           id="fileInput"
//           onChange={(e) => setFile(e.target.files?.[0] || null)}
//           className={styles.fileInput}
//         />
//         <label htmlFor="fileInput" className={styles.fileLabel}>
//           {file ? file.name : "Choose Image"}
//         </label>

//         <button
//           onClick={handleUpload}
//           className={styles.uploadButton}
//           disabled={loading || !file}
//         >
//           {loading ? "Processing..." : "Upload & Detect"}
//         </button>
//       </div>

//       {resultUrl && (
//         <div className={styles.result}>
//           <h3>Detection Result</h3>
//           <div className={styles.imageWrapper}>
//             <img src={resultUrl} alt="Detection Result" />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// 3rd
"use client";

import { useState } from "react";
import styles from "./Home.module.scss";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [resultJson, setResultJson] = useState<any>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Please select an image.");
    setLoading(true);

    // Clear previous results
    setResultJson(null);
    if (resultImage) URL.revokeObjectURL(resultImage);
    setResultImage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const base = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

      const res = await fetch(`${base}/predict`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }

      const contentType = res.headers.get("content-type");
      
      if (contentType?.includes("application/json")) {
        const data = await res.json();
        setResultJson(data);
      } else if (contentType?.includes("image/")) {
        const blob = await res.blob();
        setResultImage(URL.createObjectURL(blob));
      } else {
        throw new Error("Unsupported response type");
      }
    } catch (err: any) {
      alert("Upload failed: " + (err?.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>YOLO Object Detection</h1>
      <p className={styles.subtitle}>
        Upload an image and view detection results (JSON or annotated image).
      </p>

      <div className={styles.uploadWrapper}>
        <input
          type="file"
          accept="image/*"
          id="fileInput"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className={styles.fileInput}
        />
        <label htmlFor="fileInput" className={styles.fileLabel}>
          {file ? file.name : "Choose Image"}
        </label>

        <button
          onClick={handleUpload}
          className={styles.uploadButton}
          disabled={loading || !file}
        >
          {loading ? "Processing..." : "Upload & Detect"}
        </button>
      </div>

      {resultImage && (
        <div className={styles.result}>
          <h3>Detection Image Result</h3>
          <div className={styles.imageWrapper}>
            <img src={resultImage} alt="Detection Result" />
          </div>
        </div>
      )}

      {resultJson && (
        <div className={styles.result}>
          <h3>Detection JSON Result</h3>
          <pre className={styles.jsonOutput}>
            {JSON.stringify(resultJson, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
