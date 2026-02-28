import React from 'react';
import { Star, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

export default function ReviewCard({ review }) {
  const isVerified = review.status === 'VERIFIED';

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-xs">
            {review.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-slate-900">{review.username}</span>
              {isVerified && (
                <div className="flex items-center gap-0.5 text-secondary" title="Verified Review">
                  <CheckCircle2 size={14} fill="currentColor" className="text-white" />
                  <span className="text-[10px] font-bold uppercase tracking-tighter">Verified</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={10}
                  className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}
                />
              ))}
            </div>
          </div>
        </div>
        <span className="text-[10px] text-slate-400">
          {format(new Date(review.createdAt), 'MMM d, yyyy')}
        </span>
      </div>

      <p className="text-slate-600 text-sm leading-relaxed">
        {review.comment}
      </p>

      {review.businessName && (
        <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {review.businessName}
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            review.status === 'VERIFIED' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
          }`}>
            {review.status}
          </span>
        </div>
      )}
    </div>
  );
}
