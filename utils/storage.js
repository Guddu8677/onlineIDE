// utils/storage.js
export const saveProjectToLocalStorage = (projectId, projectData) => {
  try {
    const serializedData = JSON.stringify(projectData);
    localStorage.setItem(`project_${projectId}`, serializedData);
  } catch (error) {
    console.error("Error saving project to localStorage:", error);
  }
};

export const loadProjectFromLocalStorage = (projectId) => {
  try {
    const serializedData = localStorage.getItem(`project_${projectId}`);
    if (serializedData === null) {
      return null;
    }
    return JSON.parse(serializedData);
  } catch (error) {
    console.error("Error loading project from localStorage:", error);
    return null;
  }
};