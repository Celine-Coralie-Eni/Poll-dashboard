"use client";

import { useState } from "react";

export function EnvChecker() {
  const [showDetails, setShowDetails] = useState(false);

  const checkEnvVars = () => {
    const vars = {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "Set" : "Not set",
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? "Set" : "Not set",
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? "Set" : "Not set",
    };

    const missing = Object.entries(vars).filter(([key, value]) => value === "Not set" || !value);
    
    return { vars, missing };
  };

  const { vars, missing } = checkEnvVars();

  return (
    <div className="card bg-base-200 p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">Environment Check</h3>
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="btn btn-sm"
        >
          {showDetails ? "Hide" : "Show"} Details
        </button>
      </div>
      
      {missing.length > 0 && (
        <div className="alert alert-warning mb-2">
          <span>⚠️ Missing environment variables: {missing.map(([key]) => key).join(", ")}</span>
        </div>
      )}
      
      {showDetails && (
        <div className="text-sm space-y-1">
          {Object.entries(vars).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="font-mono">{key}:</span>
              <span className={value === "Not set" || !value ? "text-error" : "text-success"}>
                {value || "Not set"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
