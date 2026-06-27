# Tasks Frontend

![](https://github.com/markus-grosshaeuser/badges/blob/main/versions/version_1_0_0.svg)
![](https://github.com/markus-grosshaeuser/badges/blob/main/languages/TypeScript-v6_0_3.svg)
![](https://github.com/markus-grosshaeuser/badges/blob/main/frameworks/React-v19_2_6.svg)
![](https://github.com/markus-grosshaeuser/badges/blob/main/tools/Vite-v8_0_12.svg)
![](https://github.com/markus-grosshaeuser/badges/blob/main/tools/npm-v11_13_0.svg)
![](https://github.com/markus-grosshaeuser/badges/blob/main/license-MIT.svg)

A React frontend for managing task lists and tasks.

## Features

- Create, edit, and delete task lists and tasks
- View task-list completion progress
- Track task status and priority
- Assign due dates to tasks
- Collapse and expand task-list and task details
- Responsive Material UI based interface
- Internationalization support

## Tech Stack

- TypeScript 6
- React 19
- React Router
- Material UI
- Axios
- i18next
- Vite
- Vitest
- Testing Library
- ESLint
- Prettier
- Docker Compose

## Requirements

Make sure the following tools are installed:

- Node.js
- npm
- Docker Compose


## Getting Started

### A word about the docker-compose file
The docker-compose file included in this subproject is used to start the backend for __development__ purposes.

To run the whole application in a production environment, use the docker-compose file included in the project root directory.

### 1. Clone the repository
```bash 
git clone https://github.com/markus-grosshaeuser/tasks-frontend.git 
cd tasks-frontend
```

### 2. Install dependencies

```bash 
npm install
``` 

### 3. Configure environment variables

Modify the .env file according to your needs.

Example:
```bash 
VITE_API_BASE_URL=http://localhost:8080
```

### 4. Start the backend

```bash 
docker compose up -d --build
```

### 5. Start the development server

```bash 
npm run dev
``` 

The application is served by Vite. The terminal output shows the local development URL.

## Available Scripts

### Start the development server

```bash 
npm run dev
```

### Build the application

```bash 
npm run build
``` 

The production build is written to the `dist` directory.

### Preview the production build

```bash 
npm run preview
```

### Run tests

```bash 
npm run test
``` 

### Run linting

```bash 
npm run lint
```

## Project Structure

```text 
src 
├── components 
├── config 
├── dialogs 
├── domain 
├── pages 
├── utilities 
├── App.tsx 
├── index.css 
├── main.tsx 
└── theme.ts
test 
├── components 
├── dialogs 
├── pages 
├── utilities 
├── MockServer.ts 
└── setup.ts
``` 

## Configuration

The application expects an API base URL through the following Vite environment variable:

```bash 
VITE_API_BASE_URL=http://localhost:8080
```

Only variables prefixed with `VITE_` are exposed to the frontend by Vite.

## Testing

The project uses Vitest with jsdom and Testing Library.

Run the test suite with:

```bash 
npm run test
``` 

Coverage is configured through Vite/Vitest and generated with the V8 provider.

## Building for Production

Create a production build with:

```bash 
npm run build
```

The generated files are available in:

```text 
dist
``` 

You can preview the production build locally with:

```bash 
npm run preview
```

## License

### MIT

MIT License

Copyright (c) 2026 Markus Großhäuser

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE, AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES, OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT, OR OTHERWISE, ARISING FROM,
OUT OF, OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
