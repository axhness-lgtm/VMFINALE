import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export default function Admin() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [occurrences, setOccurrences] = useState([]);
  const [selectedOccurrenceId, setSelectedOccurrenceId] = useState(null);
  
  const [interests, setInterests] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Simple login
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'founder123') { // Ideally fetched from env or using proper auth
      setIsAuthenticated(true);
      fetchOccurrences();
    } else {
      setError('Invalid password');
    }
  };

  const fetchOccurrences = async () => {
    const { data, error } = await supabase.from('occurrences').select('*').order('created_at', { ascending: false });
    if (data) setOccurrences(data);
  };

  const fetchInterests = async (occurrenceId) => {
    setSelectedOccurrenceId(occurrenceId);
    setLoading(true);
    try {
      const res = await fetch('/api/admin/interests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ occurrence_id: occurrenceId, password })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);

      // Fetch bookings to get payment status and queries
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .eq('occurrence_id', occurrenceId);

      if (bookingsError) throw bookingsError;

      if (data) {
        // Merge booking data into interests
        const mergedData = data.map(interest => {
          const booking = bookingsData?.find(b => b.user_id === interest.users.id);
          return {
            ...interest,
            booking: booking || null
          };
        });

        setInterests(mergedData);
        // Automatically select users who are already 'selected_by_founder'
        const preSelected = new Set();
        mergedData.forEach(i => {
          if (i.status === 'selected_by_founder') {
            preSelected.add(i.users.id);
          }
        });
        setSelectedUsers(preSelected);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch interests. ' + err.message);
    }
    setLoading(false);
  };

  const toggleUserSelection = (userId) => {
    const newSelection = new Set(selectedUsers);
    if (newSelection.has(userId)) newSelection.delete(userId);
    else newSelection.add(userId);
    setSelectedUsers(newSelection);
  };

  const openBookings = async () => {
    if (selectedUsers.size === 0) return alert('Select at least one user.');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/open-bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          occurrence_id: selectedOccurrenceId,
          selected_user_ids: Array.from(selectedUsers),
          password // pass the password for basic auth to the API
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      alert('Bookings opened! Emails sent.');
      fetchInterests(selectedOccurrenceId);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReplyQuery = async (bookingId, replyText) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/reply-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_id: bookingId, reply_text: replyText, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      alert('Reply sent successfully!');
      fetchInterests(selectedOccurrenceId);
    } catch (err) {
      alert('Failed to send reply: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <form onSubmit={handleLogin} className="p-8 bg-white shadow-xl rounded-lg border border-[var(--text-main)]/10 w-full max-w-md">
          <h2 className="text-3xl font-heading mb-6 text-center text-[var(--text-main)]">Founder Login</h2>
          <input 
            type="password" 
            placeholder="Admin Password" 
            className="w-full p-4 border border-[var(--text-main)]/20 rounded-md mb-4 focus:outline-none focus:border-[var(--accent-primary)] font-mono"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm mb-4 font-body">{error}</p>}
          <button type="submit" className="w-full bg-[var(--text-main)] text-[var(--bg-primary)] p-4 rounded-md font-bold uppercase tracking-wider hover:bg-[var(--accent-primary)] transition-colors">Enter</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] pt-32 pb-12 px-8 font-body">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-6xl font-heading mb-12 text-[var(--text-main)]">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Occurrences List */}
          <div className="col-span-1 bg-[var(--bg-primary)] p-8 rounded-xl shadow-sm border border-[var(--text-main)]/5">
            <h2 className="text-2xl font-bold mb-6 text-[var(--text-main)]">Occurrences</h2>
            <div className="space-y-4">
              {occurrences.map(occ => (
                <div 
                  key={occ.id} 
                  onClick={() => fetchInterests(occ.id)}
                  className={`p-6 border rounded-lg cursor-pointer transition-colors ${selectedOccurrenceId === occ.id ? 'bg-[var(--accent-primary)]/5 border-[var(--accent-primary)]' : 'border-[var(--text-main)]/10 hover:border-[var(--text-main)]/30'}`}
                >
                  <h3 className="font-heading text-2xl text-[var(--text-main)]">{occ.title}</h3>
                  <p className="text-sm font-bold uppercase tracking-widest text-[var(--text-main)]/50 mt-2">{occ.status.replace(/_/g, ' ')}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Interests List */}
          <div className="col-span-1 lg:col-span-2 bg-[var(--bg-primary)] p-8 rounded-xl shadow-sm border border-[var(--text-main)]/5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <h2 className="text-2xl font-bold text-[var(--text-main)]">Active Interests</h2>
              <button 
                onClick={openBookings} 
                disabled={loading || selectedUsers.size === 0}
                className="bg-[var(--text-main)] hover:bg-[var(--accent-primary)] text-[var(--bg-primary)] px-6 py-3 rounded-md font-bold uppercase tracking-wider disabled:opacity-50 transition-colors"
              >
                {loading ? 'Processing...' : 'Open Bookings & Send Magic Links'}
              </button>
            </div>

            {!selectedOccurrenceId ? (
              <p className="text-[var(--text-main)]/50 italic">Select an occurrence to view interests.</p>
            ) : interests.length === 0 ? (
              <p className="text-[var(--text-main)]/50 italic">No interests found for this occurrence.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--text-main)]/10">
                      <th className="py-4 px-4 font-bold uppercase tracking-widest text-xs text-[var(--text-main)]/50">Select</th>
                      <th className="py-4 px-4 font-bold uppercase tracking-widest text-xs text-[var(--text-main)]/50">Name</th>
                      <th className="py-4 px-4 font-bold uppercase tracking-widest text-xs text-[var(--text-main)]/50">Instagram</th>
                      <th className="py-4 px-4 font-bold uppercase tracking-widest text-xs text-[var(--text-main)]/50">Phone</th>
                      <th className="py-4 px-4 font-bold uppercase tracking-widest text-xs text-[var(--text-main)]/50">Status / Payment</th>
                      <th className="py-4 px-4 font-bold uppercase tracking-widest text-xs text-[var(--text-main)]/50">Customer Query</th>
                    </tr>
                  </thead>
                  <tbody>
                    {interests.map(interest => (
                      <tr key={interest.id} className="border-b border-[var(--text-main)]/5 hover:bg-[var(--text-main)]/5 transition-colors">
                        <td className="py-4 px-4">
                          <input 
                            type="checkbox" 
                            className="w-5 h-5 accent-[var(--accent-primary)] cursor-pointer"
                            checked={selectedUsers.has(interest.users.id)}
                            onChange={() => toggleUserSelection(interest.users.id)}
                            disabled={interest.status === 'booked'}
                          />
                        </td>
                        <td className="py-4 px-4 font-bold text-[var(--text-main)]">{interest.users.name}</td>
                        <td className="py-4 px-4 text-[var(--accent-primary)]">{interest.users.instagram_handle}</td>
                        <td className="py-4 px-4 text-mono text-sm">{interest.users.phone}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full ${interest.status === 'interested' ? 'bg-gray-100 text-gray-600' : interest.status === 'selected_by_founder' ? 'bg-[#e86321]/10 text-[#e86321]' : 'bg-green-100 text-green-700'}`}>
                            {interest.status.replace(/_/g, ' ')}
                          </span>
                          {interest.booking && (
                            <span className="ml-2 px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full bg-blue-100 text-blue-700">
                              PAID
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-sm max-w-[200px] truncate">
                          {interest.booking?.customer_query ? (
                            <div>
                              <p className="font-bold mb-1">Q: {interest.booking.customer_query}</p>
                              {interest.booking.founder_reply ? (
                                <p className="text-xs text-green-600">Replied: {interest.booking.founder_reply}</p>
                              ) : (
                                <button onClick={() => {
                                  const reply = prompt('Reply to ' + interest.users.name + ':');
                                  if (reply) handleReplyQuery(interest.booking.id, reply);
                                }} className="text-xs bg-[var(--accent-primary)] text-white px-2 py-1 rounded">Reply</button>
                              )}
                            </div>
                          ) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
