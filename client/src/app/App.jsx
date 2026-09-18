import React, { useEffect, useState } from 'react'
import axios from "axios";
import './App.css';


const App = () => {
  const [urls, setUrls] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [currentUrl, setCurrentUrl] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [copiedMain, setCopiedMain] = useState(false);

  const BASE_URL = "https://url-shortner-nffn.onrender.com";

  //Function to fetch direct real url data from DB(Backend)
  async function fetchUrls() {
    try {
      const response = await axios.get(`${BASE_URL}/api/url`);
      const responseData = response.data.data.urls;
      setUrls(responseData);
    } catch (error) {
      console.error("Error fetching URLs:", error);
    }
  }

  //Function to create Short Url 
  async function createShortUrl() {
    if (!inputValue.trim()) return;

    try {
      const response = await axios.post(`${BASE_URL}/api/url`, {
        url: inputValue
      });

      setCurrentUrl({
        originalUrl: response.data.data.originalUrl,
        shortCode: response.data.data.shortCode
      });

      fetchUrls();
      setInputValue("");
    } catch (error) {
      console.error("Error creating short URL:", error);
    }
  }

  //Function to delete Url data directly from backend and also for Frontend  
  async function deleteUrl(id) {
    try {
      await axios.delete(`${BASE_URL}/api/url/${id}`);
      setUrls(urls.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting URL:", error);
    }
  }

  const handleCopy = (text, id = null) => {
    navigator.clipboard.writeText(text);
    if (id) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } else {
      setCopiedMain(true);
      setTimeout(() => setCopiedMain(false), 2000);
    }
  };

  const handleLinkClick = (id) => {
    setUrls((prevUrls) =>
      prevUrls.map((item) =>
        item._id === id ? { ...item, clicks: (item.clicks || 0) + 1 } : item
      )
    );
  };

  //useEffect to call function only once avoiding infinite loop 
  useEffect(() => {
    fetchUrls();
  }, []);

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex justify-center py-12 px-4 sm:px-6 lg:px-8 antialiased">
      <div className="w-full max-w-5xl flex flex-col gap-6">

        {/* Header Section */}
        <div className="text-center mb-2">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Make your URLs shorter.
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            Paste a link, get a short one, see how many people clicked it.
          </p>
        </div>

        {/* Input Bar Card */}
        <div className="bg-[#0e1626] border border-slate-800 rounded-2xl p-2.5 flex items-center gap-3 shadow-xl">
          <input
            type="text"
            value={inputValue}
            placeholder="Paste a long URL here..."
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 bg-transparent px-4 py-3 text-sm text-slate-200 outline-none placeholder:text-slate-500"
          />
          <button
            className="bg-orange-600 hover:bg-orange-500 active:scale-95 text-white font-semibold text-sm px-8 py-3 rounded-xl transition-all duration-150 cursor-pointer shadow-md shadow-orange-950/40"
            onClick={createShortUrl}
          >
            Shorten
          </button>
        </div>

        {/* Generated URL Box */}
        {currentUrl && (
          <div className="flex flex-col gap-2">
            <span className="text-emerald-400 text-xs font-semibold px-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Link shortened successfully
            </span>
            <div className="bg-[#0e1626] border border-slate-800 rounded-2xl p-4 px-6 flex items-center justify-between shadow-xl">
              <span className="text-orange-400 font-semibold text-base tracking-wide truncate max-w-[75%]">
                {BASE_URL}/{currentUrl?.shortCode}
              </span>
              <button
                onClick={() => handleCopy(`${BASE_URL}/${currentUrl.shortCode}`)}
                className="bg-orange-600 hover:bg-orange-500 active:scale-95 text-white font-medium text-xs sm:text-sm px-6 py-2.5 rounded-xl transition-all duration-150 cursor-pointer shadow-sm"
              >
                {copiedMain ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        )}

        {/* List Section Heading & Refresh */}
        <div className="mt-4 flex items-center justify-between px-1">
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">
              Total URLs :  {urls.length}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage your shortened links
            </p>
          </div>
          <button
            onClick={fetchUrls}
            className="border border-slate-700/80 hover:bg-slate-800/60 active:scale-95 text-slate-300 text-xs font-medium px-4 py-2 rounded-xl transition-all cursor-pointer"
          >
            Refresh
          </button>
        </div>

        {/* Links List Container */}
        <div className="flex flex-col gap-3">
          {urls.map((url) => (
            <div
              key={url._id}
              className="bg-[#0e1626] border border-slate-800/90 rounded-2xl p-4 px-6 flex items-center justify-between gap-6 shadow-sm hover:border-slate-700 transition-colors"
            >
              {/* Short Code Column */}
              <div className="w-28 shrink-0 flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  SHORT CODE
                </span>
                <a
                  href={`${BASE_URL}/${url.shortCode}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleLinkClick(url._id)}
                  className="text-orange-400 hover:underline font-mono text-sm font-semibold truncate mt-0.5"
                >
                  {url.shortCode}
                </a>
              </div>

              {/* Original URL Column */}
              <div className="flex-1 min-w-0 flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  ORIGINAL URL
                </span>
                <span className="text-slate-300 text-sm truncate mt-0.5 font-normal">
                  {url.originalUrl}
                </span>
              </div>

              {/* Clicks Column */}
              <div className="w-16 shrink-0 flex flex-col items-start sm:items-center">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  CLICKS
                </span>
                <span className="text-white text-sm font-semibold mt-0.5">
                  {url.clicks || 0}
                </span>
              </div>

              {/* Actions Column */}
              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={() => handleCopy(`${BASE_URL}/${url.shortCode}`, url._id)}
                  className="bg-orange-600 hover:bg-orange-500 active:scale-95 text-white text-xs font-medium px-4 py-2 rounded-xl transition-all cursor-pointer"
                >
                  {copiedId === url._id ? "Copied!" : "Copy"}
                </button>
                <button
                  onClick={() => deleteUrl(url._id)}
                  className="bg-orange-600 hover:bg-orange-500 active:scale-95 text-white text-xs font-medium px-4 py-2 rounded-xl transition-all cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default App;