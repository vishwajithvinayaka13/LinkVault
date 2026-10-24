# 🔗 LinkVault — URL Shortener

LinkVault is a full-stack URL-shortening web application built using the MERN stack. It converts long URLs into short, shareable links and provides link management, QR code generation, and click tracking.

## 🌐 Live Demo

**Website:** https://link-vault-amber.vercel.app/

**Backend API:** https://linkvault-backend-lbq1.onrender.com/

## ✨ Features

- **URL Shortening:** Convert long URLs into compact, shareable links.
- **Instant Redirection:** Redirect visitors from short links to their original destinations.
- **Link Management:** View and delete saved short links.
- **QR Code Generation:** Generate QR codes for convenient link sharing.
- **Click Tracking:** Track the number of times a short link is accessed.
- **URL Validation:** Validate URLs and allow only HTTP and HTTPS protocols.
- **Cloud Database:** Store links persistently using MongoDB Atlas.
- **Live Deployment:** Host the frontend and backend using Vercel and Render.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React | Frontend user interface |
| Vite | Frontend development and build tool |
| Node.js | Backend JavaScript runtime |
| Express.js | REST API and routing |
| MongoDB Atlas | Cloud database |
| Mongoose | MongoDB object modeling |
| nanoid | Short-code generation |
| qrcode.react | QR code generation |
| Render | Backend deployment |
| Vercel | Frontend deployment |
| Git & GitHub | Version control and source code hosting |

## 📁 Project Structure

```text
LinkVault/
├── backend/
│   ├── models/
│   │   └── Link.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/
│   ├── src/
│   │   └── App.jsx
│   ├── package.json
│   └── index.html
└── README.md
```

## ⚙️ Getting Started

### Prerequisites

Install the following:

- Node.js and npm
- Git
- A MongoDB database, either local MongoDB or MongoDB Atlas
- A code editor such as Visual Studio Code

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd LinkVault
```

Replace the placeholder with your actual GitHub repository URL.

### 2. Configure the backend

Navigate to the backend directory:

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/linkvault
BACKEND_URL=http://localhost:5000
```

For MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string. Keep database credentials private.

### 3. Start the backend

```bash
npm run dev
```

The backend should run at:

`http://localhost:5000`

Verify the backend and database connection at:

`http://localhost:5000/api/health`

### 4. Configure and start the frontend

Open a second terminal from the project root:

```bash
cd frontend
npm install
npm run dev
```

Vite will display the local frontend address, typically:

`http://localhost:5173`

For local development, ensure the API constant in `frontend/src/App.jsx` points to `http://localhost:5000`. The deployed frontend currently uses the public Render backend URL.

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Check backend and database status |
| POST | `/api/links` | Create a short link |
| GET | `/api/links` | Retrieve saved links |
| DELETE | `/api/links/:shortCode` | Delete a short link |
| GET | `/:shortCode` | Redirect to the original URL |

### Create a short link

**Request**

```http
POST /api/links
Content-Type: application/json
```

```json
{
  "originalUrl": "https://www.example.com"
}
```

The API validates the URL, generates a short code, stores the link in MongoDB, and returns the generated short URL.

## 🔄 How It Works

1. The user enters a long URL in the React interface.
2. The frontend sends an API request to the Express backend.
3. The backend validates the URL and generates a unique short code using `nanoid`.
4. Mongoose stores the original URL, short code, and associated metadata in MongoDB.
5. The application returns a short URL that can be shared with others.
6. When the short URL is opened, the backend retrieves the corresponding link, increments its click count, and redirects the visitor using an HTTP 302 response.

## ☁️ Deployment

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas

The deployed backend uses environment variables to configure its MongoDB connection and public URL.

## 🔐 Security Notes

- Never commit `.env` files, passwords, or database connection credentials.
- Use environment variables to store deployment-specific configuration.
- Restrict database permissions to the minimum required.
- Validate and sanitize incoming requests.
- Consider rate limiting, abuse prevention, and additional security controls before using the application at a larger scale.

## 🚀 Future Improvements

- User registration and authentication
- Custom short URLs
- Link expiration and expiration management
- Advanced click analytics
- Rate limiting and abuse prevention
- Automated backend and frontend tests

## 👨‍💻 Author

Developed as a full-stack web development project to explore REST APIs, database integration, URL redirection, and cloud deployment.
