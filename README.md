# CipherStudio: A Browser-Based React IDE

## Overview

CipherStudio is a web-based Integrated Development Environment (IDE) for React projects. It allows users to create, manage, edit, and preview React code directly within their browser. This project aims to simulate a real online development environment, providing users with a platform to experiment, learn, and prototype React applications.

## Features

*   **File Management:** Create, delete, and organize project files within the IDE.
*   **Code Editor:** Edit React code with syntax highlighting and other editor features (powered by Sandpack).
*   **Live Preview:** View the real-time output of the React project as the code changes.
*   **Save & Load Projects:** Persist project state in local storage, allowing users to continue working on their projects later.
*   **Theme Switcher:** Toggle between light and dark themes for a comfortable coding experience.
*   **User Authentication:** Secure login and registration functionality.

## Technologies Used

*   **Frontend:**
    *   React
    *   Next.js
    *   @codesandbox/sandpack-react (for code execution)
    *   uuid (for project ID creation)
*   **Backend:**
    *   Node.js
    *   Next.js API routes
    *   MongoDB (for user and project data storage)
    *   jsonwebtoken (JWT) (for authentication)
    *   bcryptjs (for password hashing)
*   **Other:**
    *   Local Storage (for project persistence)

## Setup and Installation

1.  **Clone the repository:**

    ```bash
    git clone <your_repository_url>
    cd cipherstudio-next
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure environment variables:**

    *   Create a `.env.local` file in the project root.
    *   Add the following variables, replacing the placeholders with your actual values:

        ```
        MONGODB_URI=your_mongodb_connection_string
        JWT_SECRET=your_jwt_secret_key
        ```

4.  **Start the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

    Visit `http://localhost:3000` in your browser to access the IDE.

## API Endpoints

*   `/api/auth/login`: Handles user login.
*   `/api/auth/register`: Handles user registration.
*   `/api/projects`:
    *   `GET`: Retrieves all projects for the current user.
    *   `POST`: Creates a new project.
*   `/api/projects/[id]`:
    *   `GET`: Retrieves a single project by ID.
    *   `PUT`: Updates a single project by ID.
    *   `DELETE`: Deletes a single project by ID.

## Directory Structure
