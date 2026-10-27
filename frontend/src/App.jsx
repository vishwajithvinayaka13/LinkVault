
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import "./App.css";
import DigitalRain from "./DigitalRain";

const API = "https://linkvault-backend-lbq1.onrender.com";

function App() {
  const [url, setUrl] = useState("");
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [qrCodeFor, setQrCodeFor] = useState(null);
  const [search, setSearch] = useState("");
const [sortBy, setSortBy] = useState("newest");
const [filterBy, setFilterBy] = useState("all");
const [serverStatus, setServerStatus] = useState("checking");
  async function fetchLinks() {
    try {
      const response = await fetch(`${API}/api/links`);
      const data = await response.json();

      if (data.success) {
        setLinks(data.links);
      }
    } catch {
      setError("Cannot connect to backend. Make sure your server is running.");
    }
  }

  async function checkHealth() {
  try {
    const res = await fetch(`${API}/api/health`);
    setServerStatus(res.ok ? "online" : "offline");
  } catch {
    setServerStatus("offline");
  }
}
useEffect(() => {
  checkHealth();

  const id = setInterval(checkHealth, 30000);

  return () => clearInterval(id);
}, []);
useEffect(() => {
  fetchLinks();

  const intervalId = setInterval(() => {
    fetchLinks();
  }, 3000);

  return () => clearInterval(intervalId);
}, []);


  async function handleShorten(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!url.trim()) {
      setError("Please enter a URL first.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API}/api/links`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalUrl: url.trim() }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to shorten URL.");
      }

      setUrl("");
      setMessage("Your short link is ready!");
      await fetchLinks();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function copyLink(shortUrl) {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setMessage("Short link copied to clipboard!");
      setError("");
    } catch {
      setError("Copy failed. Please copy the link manually.");
    }
  }

  async function deleteLink(shortCode) {
  const confirmed = window.confirm(
    "Are you sure you want to delete this short link?"
  );

  if (!confirmed) return;

  setError("");
  setMessage("");

  try {
    const response = await fetch(
      `${API}/api/links/${encodeURIComponent(shortCode)}`,
      { method: "DELETE" }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Unable to delete link.");
    }

    setMessage("Link deleted successfully!");
    await fetchLinks();
  } catch (err) {
    setError(err.message || "Could not delete the link.");
  }
}

  const totalClicks = links.reduce((total, link) => total + link.clicks, 0);

const filteredLinks = links
  .filter((link) => {
    const query = search.toLowerCase().trim();

    const matchesSearch =
      link.originalUrl.toLowerCase().includes(query) ||
      link.shortCode.toLowerCase().includes(query);

    const matchesFilter =
      filterBy === "all" ||
      (filterBy === "clicked" && link.clicks > 0) ||
      (filterBy === "unclicked" && link.clicks === 0);

    return matchesSearch && matchesFilter;
  })
  .sort((a, b) => {
    if (sortBy === "clicks") return b.clicks - a.clicks;
    if (sortBy === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
  <div className="app">
    <DigitalRain />

    <header className="topbar">
        <a className="brand" href="/">
          <span className="brand-icon">↗</span>
          LinkVault<span className="brand-dot">.</span>
        </a>
        <span className={`status ${serverStatus}`}>
  <span className="status-dot"></span>
  {serverStatus === "online"
    ? "Server online"
    : serverStatus === "checking"
    ? "Connecting..."
    : "Server offline"}
</span>
      </header>

      <main className="main">
        <section className="hero">
          <div className="eyebrow">
            <span>✦</span> YOUR LINKS, SIMPLIFIED
          </div>
          <h1>
            Shorten links.
            <br />
            <span>Track every click.</span>
          </h1>
          <p className="subtitle">
            Transform long URLs into clean, shareable links.
            Keep all your links in one place.
          </p>

          <form className="shorten-form" onSubmit={handleShorten}>
            <span className="url-icon">↗</span>
            <input
              type="text"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="Paste your long URL here..."
              aria-label="Long URL"
            />
            <button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Shorten URL"}
              {!loading && <span> →</span>}
            </button>
          </form>

          {error && <p className="notice error">{error}</p>}
          {message && <p className="notice success">{message}</p>}

          <div className="hint">
            <span>✓</span> Free to use
            <span>✓</span> Instant redirects
            <span>✓</span> Click tracking
          </div>
        </section>

        <section className="stats">
          <div className="stat-card">
            <div className="stat-label">TOTAL LINKS</div>
            <div className="stat-value">{links.length}</div>
            <div className="stat-note">Links saved in your vault</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">TOTAL CLICKS</div>
            <div className="stat-value">{totalClicks}</div>
            <div className="stat-note">Tracked short-link visits</div>
          </div>
          <div className="stat-card">
  <div className="stat-label">STATUS</div>

  <div className={`stat-value status-value ${serverStatus}`}>
    {serverStatus === "online"
      ? "Active"
      : serverStatus === "checking"
      ? "Waking up"
      : "Offline"}
  </div>

  <div className="stat-note">
    {serverStatus === "online"
      ? "Ready to shorten links"
      : "Server can take up to a minute to wake"}
  </div>
</div>
</section>
        <section className="links-section">
          <div className="section-heading">
            <div>
              <h2>Your link vault</h2>
              <p>Manage and track your shortened URLs.</p>
            </div>
            <span className="count-badge">{links.length} LINKS</span>
          </div>
          
<div className="link-controls">
  <input
    className="search-input"
    type="text"
    placeholder="Search URLs or short codes..."
    value={search}
    onChange={(event) => setSearch(event.target.value)}
  />

  <select
    value={filterBy}
    onChange={(event) => setFilterBy(event.target.value)}
    aria-label="Filter links"
  >
    <option value="all">All links</option>
    <option value="clicked">Clicked links</option>
    <option value="unclicked">Not clicked</option>
  </select>

  <select
    value={sortBy}
    onChange={(event) => setSortBy(event.target.value)}
    aria-label="Sort links"
  >
    <option value="newest">Newest first</option>
    <option value="oldest">Oldest first</option>
    <option value="clicks">Most clicks</option>
  </select>
</div>


          {filteredLinks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">↗</div>
              <h3>Your vault is waiting</h3>
              
<p>
  {links.length === 0
    ? "Paste a URL above to create your first short link."
    : "No links match your search or filter."}
</p>

            </div>
          ) : (
            <div className="link-list">
              {filteredLinks.map((link) => (
                <article className="link-card" key={link.shortCode}>
                  <div className="link-symbol">↗</div>
                  <div className="link-info">
                    <a
                      className="short-url"
                      href={link.shortUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {link.shortUrl.replace("http://", "")}
                    </a>
                    <a
  className="original-url"
  href={link.originalUrl}
  title={link.originalUrl}
  target="_blank"
  rel="noreferrer"
>
  {link.originalUrl}
</a>
                    <span className="created-date">
                      Created{" "}
                      {new Date(link.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="click-count">
                    <strong>{link.clicks}</strong>
                    <span>CLICKS</span>
                  </div>
                  <button
                    className="copy-button"
                    onClick={() => copyLink(link.shortUrl)}
                    type="button"
                  >
                    Copy
                  </button>
                  
<button
  className="delete-button"
  onClick={() => deleteLink(link.shortCode)}
  type="button"
>
  Delete
</button>

<button
  className="qr-button"
  onClick={() =>
    setQrCodeFor(
      qrCodeFor === link.shortCode ? null : link.shortCode
    )
  }
  type="button"
>
  {qrCodeFor === link.shortCode ? "Hide QR" : "Show QR"}
</button>

{qrCodeFor === link.shortCode && (
  <div className="qr-display">
    <QRCodeSVG
      value={link.shortUrl}
      size={150}
      level="M"
      includeMargin
    />
    <p>Scan to open this short link</p>
    <button
      className="copy-button"
      type="button"
      onClick={() => window.print()}
    >
      Print / Save QR
    </button>
  </div>
)}


                </article>
              ))}
            </div>
          )}
        </section>

        <footer>
          <span>LinkVault © 2026</span>
          <span>Built to keep your links in check. ↗</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
