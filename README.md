# PICCO - Michael's Health Tracker

A comprehensive health monitoring dashboard for patients with Parkinson's disease, featuring real-time data tracking, AI-powered analysis, and interactive communication.

## Features

### 1. Real-time Health Data Monitoring

- **Firebase Integration**: Connects to a Firebase Realtime Database to fetch and display patient data.
- **Real-time Updates**: Listens for changes in the database and updates the UI automatically.
- **Environmental Monitoring**: Tracks temperature, humidity, and heat index to analyze correlations with symptom severity.
- **Tremor Analysis**: Visualizes tremor duration data with corresponding environmental conditions.

### 2. Cognitive Assessment Tools

- **Clock Test**: Visualizes and tracks scores from the clock drawing test, a standard assessment for visuospatial ability.
- **Serial Seven Subtraction Test**: Monitors scores from the serial seven subtraction test for cognitive function.
- **Motor Skills Test**: Tracks performance on motor skill assessments.
- **DBRC Score**: Calculates a customisable weighted composite score based on the cognitive and motor assessments.

### 3. AI-Powered Analysis

- **OpenAI Integration**: Uses the OpenAI API to generate comprehensive patient analyses. Patient data remains confidential, as patient records are only compared against their own records with personal details redacted.
- **Context-Aware Summaries**: Considers all available health data when generating insights.

### 4. Interactive Patient Communication

- **Messaging Interface**: Allows healthcare providers to communicate directly with patients.
- **Conversation History**: Maintains context from previous messages for coherent conversations.

### 5. Historical Data Visualization

- **Monthly Analysis**: Provides trend visualizations for DBRC scores, cognitive tests, and motor skills over time.
- **Daily Logs**: Displays patient-reported daily activities, medication adherence, and symptom observations.
- **Weekly Reports**: Shows healthcare provider reports and assessments.

## Implementation Details

### Frontend Architecture

- **Framework**: Next.js App Router with React 18
- **Styling**: Tailwind CSS for responsive design
- **Components**: Custom UI components and shadcn/ui library
- **State Management**: React hooks for local state management
- **Charts**: Recharts library for data visualization

### Backend Services

- **Database**: Firebase Realtime Database
- **Authentication**: Ready for Firebase Authentication
- **AI Services**: OpenAI API integration

## Installation
No installation necessary! Simply navigate to this website: https://picco-health-h2ai.vercel.app/
