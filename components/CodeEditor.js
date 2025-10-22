// // components/CodeEditor.js
// import React, { useState, useEffect } from 'react';
// import { Sandpack } from "@codesandbox/sandpack-react";

// const CodeEditor = ({ code, onChange, activeFile, theme }) => {
//   const [sandpackFiles, setSandpackFiles] = useState({});

//   useEffect(() => {
//     if (activeFile) {
//       setSandpackFiles({
//         [activeFile]: {
//           code: code,
//           hidden: false,
//         },
//         "styles.css": {
//           code: `body { font-family: sans-serif; }`,
//           hidden: true,
//         },
//       });
//     }
//   }, [code, activeFile]);

//   const handleCodeChange = (newCode) => {
//     if (activeFile) {
//       onChange(newCode); // Call the onChange prop to update the parent component
//     }
//   };

//   const editorOptions = {
//     readOnly: false,
//     showLineNumbers: true,
//     wrapContent: true,
//     showNavigator: false,
//     showTabs: false,
//   };

//   return (
//     <div className="code-editor-container">
//       {activeFile ? (
//         <Sandpack
//           theme={theme === 'dark' ? 'dark' : 'light'}
//           files={sandpackFiles}
//           options={editorOptions}
//           template="react"
//           onCodeChange={(e) => handleCodeChange(e.code)}
//         />
//       ) : (
//         <p>Select a file to start editing.</p>
//       )}
//     </div>
//   );
// };

// export default CodeEditor;

































// components/CodeEditor.js - COMPLETE REWRITE
import React, { useEffect, useRef } from 'react';
import { 
  SandpackProvider, 
  SandpackLayout, 
  SandpackCodeEditor, 
  SandpackPreview,
  useSandpack 
} from "@codesandbox/sandpack-react";

// Helper component to sync changes back to parent
const CodeSyncHelper = ({ onFilesChange }) => {
  const { sandpack } = useSandpack();
  const timeoutRef = useRef(null);

  useEffect(() => {
    const updateFiles = () => {
      if (onFilesChange) {
        onFilesChange(sandpack.files);
      }
    };

    // Debounce updates
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(updateFiles, 1000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [sandpack.files, onFilesChange]);

  return null;
};

const CodeEditor = ({ activeFile, theme, allFiles, onFilesChange }) => {
  // Convert files object to Sandpack format
  const getSandpackFiles = () => {
    const sandpackFiles = {};
    
    Object.keys(allFiles).forEach((filename) => {
      sandpackFiles[`/${filename}`] = allFiles[filename].content;
    });

    return sandpackFiles;
  };

  return (
    <div className="code-editor-container">
      {activeFile ? (
        <SandpackProvider
          theme={theme === 'dark' ? 'dark' : 'light'}
          files={getSandpackFiles()}
          template="react"
          options={{
            activeFile: `/${activeFile}`,
            visibleFiles: Object.keys(allFiles).map(f => `/${f}`),
          }}
        >
          <CodeSyncHelper onFilesChange={onFilesChange} />
          <SandpackLayout>
            <SandpackCodeEditor
              style={{ height: '100%', flex: 1 }}
              showLineNumbers={true}
              showInlineErrors={true}
              wrapContent={true}
            />
            <SandpackPreview
              style={{ height: '100%', flex: 1 }}
              showOpenInCodeSandbox={false}
              showRefreshButton={true}
              showRestartButton={true}
            />
          </SandpackLayout>
        </SandpackProvider>
      ) : (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100%',
          color: 'var(--secondary-text)'
        }}>
          <p>Select a file to start editing.</p>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;