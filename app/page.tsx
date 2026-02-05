'use client';

import React, { useState, useEffect } from 'react';

export default function NoFapTracker() {
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [longestStreak, setLongestStreak] = useState<number>(0);
  const [totalDays, setTotalDays] = useState<number>(0);
  const [lastCheckIn, setLastCheckIn] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [checkInHistory, setCheckInHistory] = useState<Array<{ date: string; streak: number }>>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = () => {
    try {
      const streakData = localStorage.getItem('current-streak');
      const longestData = localStorage.getItem('longest-streak');
      const totalData = localStorage.getItem('total-days');
      const lastData = localStorage.getItem('last-checkin');
      const historyData = localStorage.getItem('checkin-history');

      if (streakData) setCurrentStreak(parseInt(streakData));
      if (longestData) setLongestStreak(parseInt(longestData));
      if (totalData) setTotalDays(parseInt(totalData));
      if (lastData) setLastCheckIn(lastData);
      if (historyData) setCheckInHistory(JSON.parse(historyData));
      
      setIsLoaded(true);
    } catch (error) {
      console.log('No previous data found or error loading:', error);
      setIsLoaded(true);
    }
  };

  const handleCheckIn = () => {
    const today = new Date().toDateString();
    
    if (lastCheckIn === today) {
      alert('You already checked in today! Come back tomorrow.');
      return;
    }

    const newStreak = currentStreak + 1;
    const newTotal = totalDays + 1;
    const newLongest = Math.max(newStreak, longestStreak);
    
    setCurrentStreak(newStreak);
    setTotalDays(newTotal);
    setLongestStreak(newLongest);
    setLastCheckIn(today);

    const newHistory = [...checkInHistory, { date: today, streak: newStreak }].slice(-30);
    setCheckInHistory(newHistory);

    try {
      localStorage.setItem('current-streak', newStreak.toString());
      localStorage.setItem('longest-streak', newLongest.toString());
      localStorage.setItem('total-days', newTotal.toString());
      localStorage.setItem('last-checkin', today);
      localStorage.setItem('checkin-history', JSON.stringify(newHistory));
    } catch (error) {
      console.error('Storage error:', error);
    }

    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  };

  const handleReset = () => {
    if (!confirm('Are you sure you want to reset your current streak? Your longest streak will be saved.')) {
      return;
    }

    setCurrentStreak(0);
    setLastCheckIn(null);

    try {
      localStorage.setItem('current-streak', '0');
      localStorage.removeItem('last-checkin');
    } catch (error) {
      console.error('Storage error:', error);
    }
  };

  const getMilestone = () => {
    if (currentStreak >= 365) return { icon: '👑', text: 'LEGENDARY', color: 'from-yellow-400 to-orange-500' };
    if (currentStreak >= 180) return { icon: '💎', text: 'DIAMOND', color: 'from-blue-400 to-cyan-500' };
    if (currentStreak >= 90) return { icon: '🏆', text: 'CHAMPION', color: 'from-purple-400 to-pink-500' };
    if (currentStreak >= 30) return { icon: '🔥', text: 'ON FIRE', color: 'from-orange-400 to-red-500' };
    if (currentStreak >= 7) return { icon: '⭐', text: 'RISING STAR', color: 'from-green-400 to-emerald-500' };
    return { icon: '🌱', text: 'GROWING', color: 'from-green-300 to-green-400' };
  };

  const canCheckInToday = lastCheckIn !== new Date().toDateString();
  const milestone = getMilestone();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <span className="text-4xl">🎯</span>
            NoFap Tracker
          </h1>
          <p className="text-purple-200">Your journey to self-mastery</p>
        </div>

        {showCelebration && (
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 animate-bounce border-4 border-green-400">
              <div className="text-6xl mb-2">🎉</div>
              <div className="text-2xl font-bold text-white">Day {currentStreak}!</div>
              <div className="text-purple-200">Keep going strong!</div>
            </div>
          </div>
        )}

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-6 border border-white/20 text-center">
          <div className={`inline-block px-6 py-2 rounded-full bg-gradient-to-r ${milestone.color} mb-4`}>
            <span className="text-2xl mr-2">{milestone.icon}</span>
            <span className="text-white font-bold">{milestone.text}</span>
          </div>
          
          <div className="text-8xl md:text-9xl font-bold text-white mb-4">
            {currentStreak}
          </div>
          <div className="text-2xl text-purple-200 mb-6">
            {currentStreak === 1 ? 'Day' : 'Days'} Clean
          </div>

          <button
            onClick={handleCheckIn}
            disabled={!canCheckInToday}
            className={`w-full md:w-auto px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 mx-auto ${
              canCheckInToday
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span className="text-2xl">✓</span>
            {canCheckInToday ? "I Didn't Fap Today" : 'Already Checked In Today'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🔥</span>
              <h3 className="text-purple-200 font-medium">Current Streak</h3>
            </div>
            <div className="text-4xl font-bold text-white">{currentStreak}</div>
            <div className="text-sm text-purple-300 mt-1">days strong</div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🏅</span>
              <h3 className="text-purple-200 font-medium">Longest Streak</h3>
            </div>
            <div className="text-4xl font-bold text-white">{longestStreak}</div>
            <div className="text-sm text-purple-300 mt-1">personal best</div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">📅</span>
              <h3 className="text-purple-200 font-medium">Total Clean Days</h3>
            </div>
            <div className="text-4xl font-bold text-white">{totalDays}</div>
            <div className="text-sm text-purple-300 mt-1">lifetime</div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">📈</span>
            Next Milestones
          </h3>
          <div className="space-y-3">
            {[
              { days: 7, label: 'One Week', icon: '⭐' },
              { days: 30, label: 'One Month', icon: '🔥' },
              { days: 90, label: '90 Days', icon: '🏆' },
              { days: 180, label: 'Half Year', icon: '💎' },
              { days: 365, label: 'One Year', icon: '👑' }
            ].map(({ days, label, icon }) => {
              const progress = Math.min((currentStreak / days) * 100, 100);
              const achieved = currentStreak >= days;
              
              return (
                <div key={days} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className={achieved ? 'text-green-400 font-bold' : 'text-purple-200'}>
                      {icon} {label} {achieved && '✓'}
                    </span>
                    <span className="text-purple-300">{days} days</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        achieved ? 'bg-green-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleReset}
            className="text-red-400 hover:text-red-300 text-sm underline"
          >
            Reset Current Streak (Relapse)
          </button>
        </div>

        <div className="text-center mt-8 text-purple-300 text-sm">
          <p>💪 You're stronger than your urges</p>
          <p className="mt-2 text-xs">Your progress is saved in your browser</p>
        </div>
      </div>
    </div>
  );
}
