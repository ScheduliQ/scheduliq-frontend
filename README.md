# SchedulIQ - Scheduling System Frontend

## Overview

SchedulIQ is a comprehensive scheduling and management system designed as a final project for a Software Engineering degree. This repository contains the frontend implementation built with Next.js and modern web technologies.

## Features

- **Role-based access control** - Different interfaces for managers and workers
- **Interactive calendar management** - Custom calendar implementation
- **Real-time updates** - Socket.IO implementation for live data
- **Drag and drop functionality** - Using Hello Pangea DnD
- **Responsive design** - Mobile-friendly interface with TailwindCSS
- **Data visualization** - Charts and reports using Chart.js
- **Authentication system** - Secure login and session management

## Technology Stack

- **Framework**: Next.js 15.0.0 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS, DaisyUI
- **UI Components**: NextUI
- **State Management**: React Context API
- **Authentication**: Firebase
- **Real-time Communication**: Socket.IO
- **Testing**: Cypress

## Project Structure

```
scheduliq-frontend/
├── app/                    # Main application code (Next.js App Router)
│   ├── (root)/             # Root routes
│   ├── components/         # Shared UI components
│   ├── dashboard/          # Dashboard pages
│   │   ├── manager/        # Manager-specific views
│   │   └── worker/         # Worker-specific views
│   ├── reports/            # Reporting functionalities
│   └── layout.tsx          # Root layout
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities and services
├── public/                 # Static assets
├── cypress/                # End-to-end tests
└── config/                 # Configuration files
```

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 10.x or higher

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/your-username/scheduliq-frontend.git
   cd scheduliq-frontend
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Run the development server

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm run start
```

## Testing

Run end-to-end tests with Cypress:

```bash
# Open Cypress UI
npm run cypress:open

# Run tests headlessly
npm run cypress:run
```

## Docker Support

A Dockerfile is included for containerization:

```bash
# Build the Docker image
docker build -t scheduliq-frontend .

# Run the container
docker run -p 3000:3000 scheduliq-frontend
```

## Contributors

- Kobi Alen
- Matan Kahlon

## License

This project was developed as an academic final project for a Software Engineering degree and is intended for educational purposes only. All rights reserved.
