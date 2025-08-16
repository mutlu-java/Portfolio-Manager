# Stock Price Visualization App

This application fetches and visualizes stock price data using Yahoo Finance API. It consists of a Node.js/Express backend and a React frontend with Recharts for data visualization.
## To Do
- Search Bar api connection- currently functions well but needs an improvement
- Portfolio Component


## Project Structure

```
stock-yahoo-deneme/
├── client/         # React frontend
├── server/         # Express backend
```

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm (Node Package Manager)

## Installation

### Server Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm run dev
   ```

The server will start running on http://localhost:5000

### Client Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The client application will start running on http://localhost:5173

## Features

- Real-time stock price data fetching
- Historical price data visualization
- Interactive charts using Recharts
- Cross-Origin Resource Sharing (CORS) enabled-for prod every origin is allowed
- RESTful API endpoints

## API Endpoints

- `GET /stock/:symbol` - Get current stock price and financial metrics' data
- `GET /history/:symbol` - Get historical stock data of selected stock


## Technologies Used

### Backend
- Node.js
- Express
- yahoo-finance2
- CORS

### Frontend
- React
- Vite
- Recharts




