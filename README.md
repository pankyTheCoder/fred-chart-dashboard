# FRED Chart Dashboard

## Overview

FRED Chart Dashboard is a web application built using **React**, **Vite**, and **Tailwind CSS**. It allows users to search for economic data series, visualize them as charts, and customize chart parameters.

## Features

- Search for economic data series using FRED API
- Select and visualize data in various chart formats
- Customize chart attributes such as color, labels, and time frequency
- Save and manage created charts

## Tech Stack

- **React** (Vite as the build tool)
- **TypeScript**
- **Tailwind CSS**
- **React Query** for data fetching
- **Radix UI** for components
- **ESLint** for code linting

## Installation

### Prerequisites

Make sure you have the following installed:

- **Node.js** (Latest LTS version recommended)
- **npm** or **yarn**

### Setup

1. Clone the repository:

   ```sh
   git clone <repository-url>
   cd fred-chart-dashboard
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

   or using yarn:

   ```sh
   yarn install
   ```

3. Start the development server:

   ```sh
   npm run dev
   ```

   The application will be available at `http://localhost:5173/` (default Vite port).

## Build & Deployment

To create a production build, run:

```sh
npm run build
```

This generates the optimized static files in the `dist/` folder.

To preview the production build locally:

```sh
npm run preview
```

## Docker Setup

To containerize the application using Docker:

1. Build the Docker image:

   ```sh
   docker build -t fred-chart-dashboard .
   ```

2. Run the container:

   ```sh
   docker run -p 3000:3000 fred-chart-dashboard
   ```

## CI/CD Pipeline

A GitHub Actions workflow can be used to automate builds, tests, and deployments. Refer to `.github/workflows/ci-cd.yml` for pipeline details.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License.

