# Local Pulse - Community Feed MVP
## Website: localcommunitypulse.org [Visit Website](https://www.localcommunitypulse.org/)

Think Instagram meets Yelp for local businesses. Discover what's happening in your neighborhood with AI-powered recommendations.

## Features
- **Community Feed**: Scrolling feed of local business deals and updates.
- **Explore**: Search and filter local businesses by category and rating.
- **AI Recommendations**: Get personalized local business suggestions based on your bio and ZIP code.
- **Business Submission**: Local businesses can submit their info to be featured on the platform.
- **Verified Reviews**: Only reviews verified by an admin are shown publicly.
- **No Login Required**: Just set your ZIP and bio to get started.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Lucide React, Framer Motion.
- **Backend**: Node.js, Express, Gemini API.
- **Storage**: JSON files in `/server/data`.

## Setup
1. **Environment Variables**:
   - Ensure `GEMINI_API_KEY` is set in your environment/secrets.

2. **Run the Application**:
   - Run `npm run dev` to start the full-stack application.

## AI Logic
The "Local Recs Chatbot" uses your bio and ZIP code to match you with businesses from our dataset. It explains "why" each business is a good fit for you.

## Hosting on Render
To host this project on [Render](https://render.com):

1. **Create a New Web Service**: Connect your GitHub repository.
2. **Environment Variables**:
   - `GEMINI_API_KEY`: Your Google Gemini API Key.
   - `NODE_ENV`: `production`
3. **Build Command**: `npm install && npm run build`
4. **Start Command**: `npm start`
5. **Persistent Storage (Optional)**:
   - This app stores data in JSON files in `/server/data`.
   - On Render, these files are ephemeral. To keep data across restarts, attach a **Persistent Disk** and mount it at `/server/data`.
