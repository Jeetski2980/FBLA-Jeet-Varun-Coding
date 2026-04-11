import React, { useEffect, useRef, useState } from 'react';
import { useProfile } from '../context/ProfileContext';
import FeedCard from '../components/FeedCard';
import { Loader2, Tag } from 'lucide-react';

const LEAFLET_SCRIPT_ID = 'localpulse-leaflet-script';
const LEAFLET_STYLESHEET_ID = 'localpulse-leaflet-stylesheet';
const LEAFLET_PROMISE_KEY = '__localpulseLeafletPromise';
const MAP_CENTER = [42.4224, -83.4277];
const MAP_ZOOM = 13;
const LOCAL_MARKERS = [
  { name: 'Bates Burgers', lat: 42.4467, lng: -83.3672 },
  { name: 'Joe\'s Produce Gourmet Market', lat: 42.4255, lng: -83.4348 },
  { name: 'Buddy\'s Pizza', lat: 42.3965, lng: -83.3737 },
  { name: 'La Bistecca Italian Grille', lat: 42.4338, lng: -83.4256 },
  { name: 'Anna\'s House', lat: 42.4075, lng: -83.4334 },
  { name: 'Michi Ramen', lat: 42.4324, lng: -83.4224 },
  { name: 'One Under Craft Beer Fest', lat: 42.4594, lng: -83.3769 },
  { name: 'Biggby Coffee', lat: 42.4206, lng: -83.4298 },
  { name: 'Thai Ocha', lat: 42.4026, lng: -83.3732 },
  { name: 'Thomas\'s Family Dining', lat: 42.4157, lng: -83.4271 },
  { name: 'Las Palapas', lat: 42.4318, lng: -83.4175 },
  { name: 'Shish Kabob Express', lat: 42.4288, lng: -83.4196 },
  { name: 'BJ\'s Restaurant & Brewhouse', lat: 42.4625, lng: -83.3714 },
  { name: 'Canton Brew Works', lat: 42.3082, lng: -83.4825 },
  { name: 'Noodles & Company', lat: 42.4591, lng: -83.3728 },
  { name: 'The Bagel Factory', lat: 42.4305, lng: -83.4209 },
  { name: 'Granite City Food & Brewery', lat: 42.4636, lng: -83.3696 },
  { name: 'Leo\'s Coney Island', lat: 42.4552, lng: -83.4098 },
  { name: 'Dave & Buster\'s', lat: 42.4632, lng: -83.3732 },
  { name: 'Tropical Smoothie Cafe', lat: 42.4196, lng: -83.4311 },
];

function loadLeaflet() {
  if (window.L?.map) {
    return Promise.resolve(window.L);
  }

  if (window[LEAFLET_PROMISE_KEY]) {
    return window[LEAFLET_PROMISE_KEY];
  }

  window[LEAFLET_PROMISE_KEY] = new Promise((resolve, reject) => {
    let stylesheet = document.getElementById(LEAFLET_STYLESHEET_ID);
    let script = document.getElementById(LEAFLET_SCRIPT_ID);

    const cleanup = () => {
      script?.removeEventListener('load', handleLoad);
      script?.removeEventListener('error', handleError);
    };

    const handleLoad = () => {
      if (window.L?.map) {
        cleanup();
        resolve(window.L);
        return;
      }

      handleError(new Error('Leaflet loaded without exposing the map API.'));
    };

    const handleError = (error) => {
      cleanup();
      delete window[LEAFLET_PROMISE_KEY];
      reject(error instanceof Error ? error : new Error('Leaflet failed to load.'));
    };

    if (!stylesheet) {
      stylesheet = document.createElement('link');
      stylesheet.id = LEAFLET_STYLESHEET_ID;
      stylesheet.rel = 'stylesheet';
      stylesheet.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(stylesheet);
    }

    if (!script) {
      script = document.createElement('script');
      script.id = LEAFLET_SCRIPT_ID;
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      document.head.appendChild(script);
    }

    script.addEventListener('load', handleLoad);
    script.addEventListener('error', handleError);

    if (window.L?.map) {
      handleLoad();
    }
  });

  return window[LEAFLET_PROMISE_KEY];
}

async function fetchDealsFeed(zip, signal) {
  const response = await fetch(`/api/feed?zip=${encodeURIComponent(zip)}&type=DEAL`, {
    cache: 'no-store',
    signal,
  });

  if (!response.ok) {
    throw new Error('Failed to load deals.');
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export default function Deals() {
  const { profile } = useProfile();
  const { zip } = profile;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!zip) {
      setPosts([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    setLoading(true);

    fetchDealsFeed(zip, controller.signal)
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    const stream = new EventSource(`/api/feed/stream?zip=${encodeURIComponent(zip)}&type=DEAL`);

    stream.addEventListener('feed-changed', () => {
      void fetchDealsFeed(zip)
        .then((data) => {
          setPosts(data);
          setLoading(false);
        })
        .catch(() => {});
    });

    return () => {
      controller.abort();
      stream.close();
    };
  }, [zip]);

  useEffect(() => {
    let cancelled = false;
    let mapInstance = null;

    const initializeMap = async () => {
      if (!mapRef.current) {
        return;
      }

      try {
        const leaflet = await loadLeaflet();

        if (cancelled || !mapRef.current) {
          return;
        }

        mapInstance = leaflet.map(mapRef.current, {
          center: MAP_CENTER,
          zoom: MAP_ZOOM,
          zoomControl: true,
          scrollWheelZoom: true,
        });

        leaflet.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
          subdomains: 'abcd',
        }).addTo(mapInstance);

        const bounds = leaflet.latLngBounds([]);

        LOCAL_MARKERS.forEach((business) => {
          const marker = leaflet
            .marker([business.lat, business.lng])
            .addTo(mapInstance)
            .bindPopup(`<strong>${business.name}</strong>`);

          bounds.extend(marker.getLatLng());
        });

        bounds.extend(MAP_CENTER);
        mapInstance.fitBounds(bounds, { padding: [28, 28] });
      } catch (error) {
        console.error('Failed to initialize local map:', error);
      }
    };

    void initializeMap();

    return () => {
      cancelled = true;

      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, []);

  const handleUpdateDeal = (updated) => {
    setPosts((prev) => prev.map((post) => (post.id === updated.id ? updated : post)));
  };

  const handleDeleteDeal = (id) => {
    setPosts((prev) => prev.filter((post) => post.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-12">
        <h1 tabIndex={0} className="text-4xl font-black text-white flex items-center gap-4 tracking-tight">
          <Tag className="text-purple-800" size={40} />
          Local Deals
        </h1>
        <p className="text-white font-medium mt-2">Save money while supporting local in {zip || 'your area'}</p>
      </div>

      <section className="mb-12 bg-white/10 rounded-[40px] border border-white/20 shadow-2xl p-4 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-5">
          <div>
            <p className="text-white font-black uppercase tracking-[0.2em] text-xs mb-2">Business Map</p>
            <h2 className="text-2xl font-black text-white tracking-tight">Businesses near {zip || 'your ZIP code'}</h2>
          </div>
        </div>

        <div className="relative rounded-[28px] overflow-hidden border border-white/20 bg-slate-200 min-h-[420px]">
          <div ref={mapRef} className="h-[420px] w-full" />
        </div>

        <p className="text-white text-sm font-medium mt-4 leading-relaxed">
          Browse the surrounding area directly on the map while you check the latest local deals below.
        </p>
      </section>

      <div className="max-w-2xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="animate-spin text-white mb-6" size={48} />
            <p className="text-white font-black uppercase tracking-[0.2em] text-xs">Hunting for deals...</p>
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <FeedCard
                key={post.id}
                post={post}
                onUpdate={handleUpdateDeal}
                onDelete={handleDeleteDeal}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white/10 rounded-[40px] border border-white/20 shadow-2xl">
            <p className="text-white font-black uppercase tracking-widest text-sm mb-2">No active deals</p>
            <p className="text-white text-xs font-medium">
              {zip ? 'Check back soon for new offers in your area!' : 'Add a ZIP code to your profile to load location-based deals.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
