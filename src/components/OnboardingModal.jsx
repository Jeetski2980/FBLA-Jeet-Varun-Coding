import React, { useState } from 'react';
import { useProfile } from '../context/ProfileContext';
import { MapPin, ArrowRight, Sparkles, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function OnboardingModal() {
  const { profile, updateProfile, isComplete } = useProfile();
  const [zip, setZip] = useState(profile.zip || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [username, setUsername] = useState(profile.username || '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!/^\d{5}$/.test(zip)) {
      setError('Please enter a valid 5-digit ZIP code.');
      return;
    }
    if (bio.length < 10) {
      setError('Please write a bit more in your bio (min 10 chars).');
      return;
    }
    if (!username) {
      setError('Please enter a username.');
      return;
    }
    updateProfile({ zip, bio, username });
  };

  if (isComplete) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="text-primary" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome to Local Pulse</h2>
          <p className="text-slate-500 text-sm">
            Tell us a bit about yourself to get personalized local recommendations.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <User size={14} />
              Username
            </label>
            <input
              type="text"
              placeholder="How should we call you?"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <MapPin size={14} />
              ZIP Code
            </label>
            <input
              type="text"
              placeholder="e.g. 48187"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              className="input"
              maxLength={5}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Sparkles size={14} />
              Your Interests (Bio)
            </label>
            <textarea
              placeholder="I love cheap sushi, quiet cafes for studying, and local gyms..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="input min-h-[100px] text-sm"
              required
            />
            <p className="text-[10px] text-slate-400 mt-1">This helps our AI find the best spots for you.</p>
          </div>

          {error && <p className="text-red-500 text-xs text-center">{error}</p>}

          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 py-3">
            Enter the Loop
            <ArrowRight size={20} />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
