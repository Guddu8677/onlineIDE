// // pages/index.js
// import { useContext, useState, useEffect } from 'react';
// import { AuthContext } from '../context/AuthContext';
// import { useRouter } from 'next/router';
// import FileExplorer from '../components/FileExplorer';
// import CodeEditor from '../components/CodeEditor';
// // import Preview from '../components/Preview'; // REMOVED
// import { saveProjectToLocalStorage, loadProjectFromLocalStorage } from '../utils/storage'; // Import storage functions
// import { v4 as uuidv4 } from 'uuid';
// import Head from 'next/head';
// import ThemeSwitcher from '../components/ThemSwitcher'; // REMOVED

// const HomePage = () => {
//   const { user, logout } = useContext(AuthContext);
//   const router = useRouter();
//   const [projectData, setProjectData] = useState({
//     files: {
//       'index.js': {
//         content: '// Your React Code Here',
//       },
//     },
//     activeFile: 'index.js',
//   });
//   const [theme, setTheme] = useState('light');
//   const [autosave, setAutosave] = useState(true);
//   const [projectId, setProjectId] = useState(null);

//   useEffect(() => {
//     if (!user) {
//       router.push('/login');
//     }

//     // Attempt to load project when user logs in, or generate a new project id
//     if (user) {
//       const storedProjectId = localStorage.getItem('currentProjectId');

//       if (storedProjectId) {
//         setProjectId(storedProjectId);
//         const loadedProject = loadProjectFromLocalStorage(storedProjectId);
//         if (loadedProject) {
//           setProjectData(loadedProject);
//         } else {
//           createNewProject();
//         }
//       } else {
//         createNewProject();
//       }
//     }
//   }, [user]);

//   useEffect(() => {
//     if (autosave && projectId) {
//       const timer = setTimeout(() => {
//         saveProjectToLocalStorage(projectId, projectData);
//         console.log('Project saved automatically');
//       }, 1000); // Save every 1 seconds

//       return () => clearTimeout(timer);
//     }
//   }, [projectData, autosave, projectId]);

//   const createNewProject = () => {
//     const newProjectId = uuidv4();
//     localStorage.setItem('currentProjectId', newProjectId);
//     setProjectId(newProjectId);

//     const initialProjectData = {
//       files: {
//         'index.js': {
//           content: '// Your React Code Here',
//         },
//       },
//       activeFile: 'index.js',
//     };
//     setProjectData(initialProjectData);
//     saveProjectToLocalStorage(newProjectId, initialProjectData);
//   };

//   const handleLogout = () => {
//     logout();
//   };

//   const handleFileChange = (filename, content) => {
//     setProjectData((prev) => ({
//       ...prev,
//       files: {
//         ...prev.files,
//         [filename]: { content },
//       },
//     }));
//   };

//   const handleFileSelect = (filename) => {
//     setProjectData({ ...projectData, activeFile: filename });
//   };

//   const handleFileCreate = (filename) => {
//     setProjectData((prev) => ({
//       ...prev,
//       files: { ...prev.files, [filename]: { content: '' } },
//     }));
//   };

//   const handleFileDelete = (filename) => {
//     const { [filename]: deleted, ...remainingFiles } = projectData.files;
//     setProjectData({
//       ...projectData,
//       files: remainingFiles,
//       activeFile: Object.keys(remainingFiles)[0] || null, // Select the first remaining file or null
//     });
//   };

//   const toggleTheme = () => {
//     setTheme(theme === 'light' ? 'dark' : 'light');
//   };

//   const toggleAutosave = () => {
//     setAutosave(!autosave);
//   };

//   if (!user) {
//     return null; // or a loading indicator
//   }

//   return (
//     <div className={`container ${theme}`}>
//       <Head>
//         <title>CipherStudio</title>
//       </Head>
//       <header className="header">
//         <h1>CipherStudio</h1>
//         <div className="header-buttons">
//           <span>Welcome, {user.email}</span>
//           <button onClick={toggleAutosave}>Autosave: {autosave ? 'On' : 'Off'}</button>
//           <button onClick={handleLogout}>Logout</button>
//         </div>
//       </header>
//       <main className="main-content">
//         <FileExplorer
//           files={projectData.files}
//           activeFile={projectData.activeFile}
//           onFileSelect={handleFileSelect}
//           onFileCreate={handleFileCreate}
//           onFileDelete={handleFileDelete}
//         />
//         <CodeEditor
//           code={projectData.files[projectData.activeFile]?.content || ''}
//           onChange={(content) => handleFileChange(projectData.activeFile, content)}
//           activeFile={projectData.activeFile}
//           theme={theme}
//         />
        
//       </main>
//       <footer className="footer">
//         <p>&copy; 2025 CipherStudio</p>
//       </footer>
//     </div>
//   );
// };

// export default HomePage;



































// pages/index.js
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/router';
import FileExplorer from '../components/FileExplorer';
import CodeEditor from '../components/CodeEditor';
import { saveProjectToLocalStorage, loadProjectFromLocalStorage } from '../utils/storage';
import { v4 as uuidv4 } from 'uuid';
import Head from 'next/head';
import ThemeSwitcher from '../components/ThemSwitcher'; // Fixed typo

const HomePage = () => {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();
  const [projectData, setProjectData] = useState({
    files: {
      'App.js': {
        content: `export default function App() {
  return (
    <div>
      <h1>Hello World</h1>
      <p>Start editing to see changes!</p>
    </div>
  );
}`,
      },
    },
    activeFile: 'App.js',
  });
  const [theme, setTheme] = useState('light');
  const [autosave, setAutosave] = useState(true);
  const [projectId, setProjectId] = useState(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }

    if (user) {
      const storedProjectId = localStorage.getItem('currentProjectId');

      if (storedProjectId) {
        setProjectId(storedProjectId);
        const loadedProject = loadProjectFromLocalStorage(storedProjectId);
        if (loadedProject) {
          setProjectData(loadedProject);
        } else {
          createNewProject();
        }
      } else {
        createNewProject();
      }
    }
  }, [user]);

  useEffect(() => {
    if (autosave && projectId) {
      const timer = setTimeout(() => {
        saveProjectToLocalStorage(projectId, projectData);
        console.log('Project saved automatically');
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [projectData, autosave, projectId]);

  const createNewProject = () => {
    const newProjectId = uuidv4();
    localStorage.setItem('currentProjectId', newProjectId);
    setProjectId(newProjectId);

    const initialProjectData = {
      files: {
        'App.js': {
          content: `export default function App() {
  return (
    <div>
      <h1>Hello World</h1>
      <p>Start editing to see changes!</p>
    </div>
  );
}`,
        },
      },
      activeFile: 'App.js',
    };
    setProjectData(initialProjectData);
    saveProjectToLocalStorage(newProjectId, initialProjectData);
  };

  const handleLogout = () => {
    logout();
  };

  const handleFileChange = (filename, content) => {
    setProjectData((prev) => ({
      ...prev,
      files: {
        ...prev.files,
        [filename]: { content },
      },
    }));
  };

  const handleFileSelect = (filename) => {
    setProjectData({ ...projectData, activeFile: filename });
  };

  const handleFileCreate = (filename) => {
    // Add appropriate extension if not present
    let finalFilename = filename;
    if (!filename.includes('.')) {
      finalFilename = `${filename}.js`;
    }

    setProjectData((prev) => ({
      ...prev,
      files: { 
        ...prev.files, 
        [finalFilename]: { 
          content: `// ${finalFilename}\nexport default function Component() {\n  return <div>New Component</div>;\n}` 
        } 
      },
      activeFile: finalFilename,
    }));
  };

  const handleFileDelete = (filename) => {
    const { [filename]: deleted, ...remainingFiles } = projectData.files;
    setProjectData({
      ...projectData,
      files: remainingFiles,
      activeFile: Object.keys(remainingFiles)[0] || null,
    });
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleAutosave = () => {
    setAutosave(!autosave);
  };

  if (!user) {
    return null;
  }

  return (
    <div className={`container ${theme}`}>
      <Head>
        <title>CipherStudio</title>
      </Head>
      <header className="header">
        <h1>CipherStudio</h1>
        <div className="header-buttons">
          <span>Welcome, {user.email}</span>
          <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
          <button onClick={toggleAutosave}>Autosave: {autosave ? 'On' : 'Off'}</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <main className="main-content">
        <FileExplorer
          files={projectData.files}
          activeFile={projectData.activeFile}
          onFileSelect={handleFileSelect}
          onFileCreate={handleFileCreate}
          onFileDelete={handleFileDelete}
        />
        <CodeEditor
  activeFile={projectData.activeFile}
  theme={theme}
  allFiles={projectData.files}
  onFilesChange={(newFiles) => {
    const updatedFiles = {};
    Object.keys(newFiles).forEach(filename => {
      const cleanFilename = filename.startsWith('/') ? filename.slice(1) : filename;
      updatedFiles[cleanFilename] = { 
        content: typeof newFiles[filename] === 'string' 
          ? newFiles[filename] 
          : newFiles[filename].code 
      };
    });
    setProjectData(prev => ({
      ...prev,
      files: updatedFiles
    }));
  }}
/>
      </main>
      <footer className="footer">
        <p>&copy; 2025 CipherStudio</p>
      </footer>
    </div>
  );
};

export default HomePage;