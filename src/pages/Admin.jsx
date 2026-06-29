import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export default function Admin() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dispatch'); // 'dispatch' | 'occurrences' | 'community'

  // Data state
  const [occurrences, setOccurrences] = useState([]);
  const [selectedOccurrenceId, setSelectedOccurrenceId] = useState(null);
  const [interests, setInterests] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [communityCount, setCommunityCount] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Email customization state
  const [customSubject, setCustomSubject] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [menuUrl, setMenuUrl] = useState('');
  const [viewModalGuest, setViewModalGuest] = useState(null);

  // New Occurrence state
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newSeats, setNewSeats] = useState(8);
  const [newPrice, setNewPrice] = useState(2999);
  const [newStatus, setNewStatus] = useState('collecting_interests');

  // Community Blast state
  const [blastOccId, setBlastOccId] = useState('');
  const [blastSubject, setBlastSubject] = useState('');
  const [blastMessage, setBlastMessage] = useState('');
  const [blastPosterUrl, setBlastPosterUrl] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'Hyndavio@1001') {
      setIsAuthenticated(true);
      fetchOccurrences();
      fetchCommunityCount();
    } else {
      setError('Invalid password');
    }
  };

  const fetchOccurrences = async () => {
    try {
      const res = await fetch('/api/occurrences');
      const data = await res.json();
      if (data.success && data.occurrences) {
        setOccurrences(data.occurrences);
        if (!selectedOccurrenceId && data.occurrences.length > 0) {
          setSelectedOccurrenceId(data.occurrences[0].id);
          setBlastOccId(data.occurrences[0].id);
          fetchInterests(data.occurrences[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching occurrences:', err);
    }
  };

  const fetchCommunityCount = async () => {
    try {
      const res = await fetch('/api/admin/get-community-count');
      const data = await res.json();
      if (data.success) setCommunityCount(data.count);
    } catch (err) {
      console.error('Error fetching community count:', err);
    }
  };

  const fetchInterests = async (occurrenceId) => {
    setSelectedOccurrenceId(occurrenceId);
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/get-interests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ occurrence_id: occurrenceId, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.details || data.error);
      setInterests(data.interests || []);
      setSelectedUsers(new Set());
    } catch (err) {
      setError('Failed to fetch interests: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserSelection = (userId) => {
    const newSelection = new Set(selectedUsers);
    if (newSelection.has(userId)) newSelection.delete(userId);
    else newSelection.add(userId);
    setSelectedUsers(newSelection);
  };

  // Supabase file upload helper
  const uploadImageToSupabase = async (file, setUrlCallback) => {
    if (!file) return;
    setLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const { error: uploadErr } = await supabase.storage.from('dinner-images').upload(fileName, file, { upsert: true });
      if (uploadErr) throw uploadErr;

      const { data: { publicUrl } } = supabase.storage.from('dinner-images').getPublicUrl(fileName);
      setUrlCallback(publicUrl);
      alert('✅ Image uploaded successfully to Supabase cloud!');
    } catch (err) {
      alert('❌ Image upload error: ' + err.message);
    } finally {
      setLoading(false);
    }
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
          password,
          custom_subject: customSubject,
          custom_message: customMessage,
          poster_url: posterUrl,
          menu_url: menuUrl
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.details || data.error);
      alert('🎉 Bookings opened! Magic link invitations sent.');
      fetchInterests(selectedOccurrenceId);
    } catch (err) {
      alert('Error sending magic links: ' + err.message);
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
      if (!res.ok) throw new Error(data.details || data.error);
      alert('✅ Reply sent successfully!');
      fetchInterests(selectedOccurrenceId);
    } catch (err) {
      alert('Failed to send reply: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create new occurrence
  const handleCreateOccurrence = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/create-occurrence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          event_date: new Date(newDate).toISOString(),
          total_seats: newSeats,
          price_inr: newPrice * 100,
          status: newStatus,
          password
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.details || data.error);
      alert(`✅ Occurrence "${newTitle}" created successfully!`);
      setNewTitle('');
      setNewDate('');
      fetchOccurrences();
    } catch (err) {
      alert('Error creating occurrence: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/update-occurrence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.details || data.error);
      fetchOccurrences();
    } catch (err) {
      alert('Error updating status: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // CSV file parser & upload
  const handleCsvUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      const lines = text.split(/\r\n|\n/).filter(line => line.trim() !== '');
      if (lines.length < 2) return alert('CSV appears empty or missing headers.');

      const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
      const nameIdx = headers.findIndex(h => h.includes('name'));
      const emailIdx = headers.findIndex(h => h.includes('email') || h.includes('mail'));
      const phoneIdx = headers.findIndex(h => h.includes('phone') || h.includes('mobile') || h.includes('contact'));
      const instaIdx = headers.findIndex(h => h.includes('insta') || h.includes('ig') || h.includes('handle'));

      if (emailIdx === -1) return alert('CSV must contain an Email column.');

      const parsedUsers = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
        if (cols[emailIdx] && cols[emailIdx].includes('@')) {
          parsedUsers.push({
            name: nameIdx !== -1 ? cols[nameIdx] : 'Community Member',
            email: cols[emailIdx],
            phone: phoneIdx !== -1 ? cols[phoneIdx] : 'N/A',
            instagram: instaIdx !== -1 ? cols[instaIdx] : null
          });
        }
      }

      setLoading(true);
      try {
        const res = await fetch('/api/admin/upload-csv', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ users: parsedUsers, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.details || data.error);
        alert('🎉 ' + data.message);
        fetchCommunityCount();
      } catch (err) {
        alert('Error uploading CSV: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
  };

  const handleCommunityBlast = async () => {
    if (!blastOccId) return alert('Please select an occurrence to announce.');
    if (!confirm(`Are you sure you want to send an announcement email to all ${communityCount} community members?`)) return;

    setLoading(true);
    try {
      const res = await fetch('/api/admin/community-blast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          occurrence_id: blastOccId,
          custom_subject: blastSubject,
          custom_message: blastMessage,
          poster_url: blastPosterUrl,
          password
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.details || data.error);
      alert('🎉 ' + data.message);
    } catch (err) {
      alert('Blast error: ' + err.message);
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
            placeholder="Admin Password (founder123)" 
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
    <div className="min-h-screen bg-[var(--bg-secondary)] pt-32 pb-16 px-8 font-body">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-5xl font-heading text-[var(--text-main)]">Founder Suite</h1>
          
          {/* Tab navigation */}
          <div className="flex flex-wrap gap-2 bg-[var(--bg-primary)] p-2 rounded-lg border border-[var(--text-main)]/10 shadow-sm">
            <button 
              onClick={() => setActiveTab('dispatch')}
              className={`px-4 py-2 rounded font-bold text-sm transition-all ${activeTab === 'dispatch' ? 'bg-[var(--accent-primary)] text-white shadow' : 'text-[var(--text-main)]/70 hover:bg-[var(--text-main)]/5'}`}
            >
              👥 Active Waitlist & Dispatch
            </button>
            <button 
              onClick={() => setActiveTab('occurrences')}
              className={`px-4 py-2 rounded font-bold text-sm transition-all ${activeTab === 'occurrences' ? 'bg-[var(--accent-primary)] text-white shadow' : 'text-[var(--text-main)]/70 hover:bg-[var(--text-main)]/5'}`}
            >
              🍽️ Create & Manage Occurrences
            </button>
            <button 
              onClick={() => setActiveTab('community')}
              className={`px-4 py-2 rounded font-bold text-sm transition-all ${activeTab === 'community' ? 'bg-[var(--accent-primary)] text-white shadow' : 'text-[var(--text-main)]/70 hover:bg-[var(--text-main)]/5'}`}
            >
              📢 Community Waitlist ({communityCount})
            </button>
          </div>
        </div>

        {/* ── TAB 1: DISPATCH & ACTIVE INTERESTS ── */}
        {activeTab === 'dispatch' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Occurrences Sidebar */}
            <div className="col-span-1 bg-[var(--bg-primary)] p-6 rounded-xl shadow-sm border border-[var(--text-main)]/5">
              <h2 className="text-xl font-bold mb-4 text-[var(--text-main)]">Select Occurrence</h2>
              <div className="space-y-3">
                {occurrences.map(occ => {
                  const sold = occ.sold_seats || 0;
                  const total = occ.total_seats || 8;
                  const isSoldOut = sold >= total;
                  return (
                    <div 
                      key={occ.id} 
                      onClick={() => fetchInterests(occ.id)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedOccurrenceId === occ.id ? 'bg-[var(--accent-primary)]/10 border-[var(--accent-primary)] shadow-sm' : 'border-[var(--text-main)]/10 hover:border-[var(--text-main)]/30'}`}
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="font-heading text-lg text-[var(--text-main)]">{occ.title}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${isSoldOut ? 'bg-red-600 text-white animate-pulse' : 'bg-green-100 text-green-800'}`}>
                          {isSoldOut ? '🔴 SOLD OUT' : `🎟️ ${sold}/${total} Sold`}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2 text-xs font-bold uppercase tracking-wider text-[var(--text-main)]/60">
                        <span>{new Date(occ.event_date).toLocaleDateString()}</span>
                        <span className="px-2 py-0.5 rounded bg-[var(--text-main)]/5 text-[var(--accent-primary)]">{occ.status.replace(/_/g, ' ')}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interests & Dispatch Main Panel */}
            <div className="col-span-1 lg:col-span-2 bg-[var(--bg-primary)] p-8 rounded-xl shadow-sm border border-[var(--text-main)]/5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-[var(--text-main)]">Active Invite List</h2>
                <button 
                  onClick={openBookings} 
                  disabled={loading || selectedUsers.size === 0}
                  className="bg-[var(--accent-primary)] hover:bg-[#c95318] text-white px-6 py-3 rounded-md font-bold uppercase tracking-wider shadow-md disabled:opacity-50 transition-all transform hover:-translate-y-0.5"
                >
                  {loading ? 'Sending Emails...' : `Send Magic Links (${selectedUsers.size})`}
                </button>
              </div>

              {selectedOccurrenceId && (
                <div className="mb-8 p-6 bg-[var(--bg-secondary)] border border-[var(--text-main)]/10 rounded-lg space-y-4">
                  <h3 className="font-heading text-xl text-[var(--text-main)] flex items-center gap-2">
                    <span>✉️ Customize Invitation & Embed Images</span>
                  </h3>
                  <p className="text-xs text-[var(--text-main)]/70">
                    Upload image files directly from your computer or paste public URLs.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-[var(--text-main)]/70 mb-1">1. Poster Image (Top)</label>
                      <div className="flex gap-2">
                        <input 
                          type="url" 
                          placeholder="https://... or upload ->" 
                          className="w-full p-2 border border-[var(--text-main)]/20 rounded bg-[var(--bg-primary)] text-xs font-mono"
                          value={posterUrl}
                          onChange={e => setPosterUrl(e.target.value)}
                        />
                        <label className="bg-[var(--text-main)] text-white px-3 py-2 rounded text-xs font-bold cursor-pointer hover:bg-black whitespace-nowrap flex items-center">
                          📁 Upload
                          <input type="file" accept="image/*" className="hidden" onChange={e => uploadImageToSupabase(e.target.files?.[0], setPosterUrl)} />
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-[var(--text-main)]/70 mb-1">2. Menu Image (Bottom)</label>
                      <div className="flex gap-2">
                        <input 
                          type="url" 
                          placeholder="https://... or upload ->" 
                          className="w-full p-2 border border-[var(--text-main)]/20 rounded bg-[var(--bg-primary)] text-xs font-mono"
                          value={menuUrl}
                          onChange={e => setMenuUrl(e.target.value)}
                        />
                        <label className="bg-[var(--text-main)] text-white px-3 py-2 rounded text-xs font-bold cursor-pointer hover:bg-black whitespace-nowrap flex items-center">
                          📁 Upload
                          <input type="file" accept="image/*" className="hidden" onChange={e => uploadImageToSupabase(e.target.files?.[0], setMenuUrl)} />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[var(--text-main)]/70 mb-1">Subject Line</label>
                    <input 
                      type="text" 
                      placeholder="e.g. You're invited: Vantammayilu Dinner" 
                      className="w-full p-2 border border-[var(--text-main)]/20 rounded bg-[var(--bg-primary)] text-sm mb-3"
                      value={customSubject}
                      onChange={e => setCustomSubject(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[var(--text-main)]/70 mb-1">Founder's Note</label>
                    <textarea 
                      rows="2" 
                      placeholder="Write a personal welcome message..." 
                      className="w-full p-2 border border-[var(--text-main)]/20 rounded bg-[var(--bg-primary)] text-sm"
                      value={customMessage}
                      onChange={e => setCustomMessage(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {!selectedOccurrenceId ? (
                <p className="text-[var(--text-main)]/50 italic">Select an occurrence to view interests.</p>
              ) : interests.length === 0 ? (
                <p className="text-[var(--text-main)]/50 italic">No guests have clicked "I'm Interested" for this dinner yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--text-main)]/10">
                        <th className="py-3 px-3 text-xs uppercase tracking-widest text-[var(--text-main)]/50">Select</th>
                        <th className="py-3 px-3 text-xs uppercase tracking-widest text-[var(--text-main)]/50">Guest</th>
                        <th className="py-3 px-3 text-xs uppercase tracking-widest text-[var(--text-main)]/50">Contact</th>
                        <th className="py-3 px-3 text-xs uppercase tracking-widest text-[var(--text-main)]/50">Status</th>
                        <th className="py-3 px-3 text-xs uppercase tracking-widest text-[var(--text-main)]/50">Details & Link</th>
                      </tr>
                    </thead>
                    <tbody>
                      {interests.map(item => {
                        const u = item.users || {};
                        const isPaid = item.is_paid || item.status === 'PAID' || item.status === 'booked';
                        return (
                          <tr key={item.id} className="border-b border-[var(--text-main)]/5 hover:bg-[var(--text-main)]/5">
                            <td className="py-3 px-3">
                              <input 
                                type="checkbox" 
                                checked={selectedUsers.has(u.id)}
                                onChange={() => toggleUserSelection(u.id)}
                                disabled={isPaid}
                                className="w-4 h-4 accent-[var(--accent-primary)]"
                              />
                            </td>
                            <td className="py-3 px-3 font-bold">{u.name}</td>
                            <td className="py-3 px-3 text-xs font-mono">{u.email}<br/>{u.phone}</td>
                            <td className="py-3 px-3">
                              <span className={`px-2.5 py-1 rounded text-xs uppercase font-extrabold tracking-wider ${isPaid ? 'bg-green-600 text-white shadow-sm' : item.status === 'selected_by_founder' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                                {isPaid ? `🎟️ PAID (${item.seats || 1} SEAT)` : item.status.replace(/_/g, ' ')}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <button
                                onClick={() => setViewModalGuest(item)}
                                className="bg-[var(--bg-secondary)] hover:bg-[var(--accent-primary)] hover:text-white text-[var(--text-main)] px-3 py-1.5 rounded border border-[var(--text-main)]/20 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                              >
                                <span>👁️ View & Link</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 2: OCCURRENCES MANAGEMENT ── */}
        {activeTab === 'occurrences' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Create form */}
            <div className="col-span-1 bg-[var(--bg-primary)] p-6 rounded-xl shadow-sm border border-[var(--text-main)]/5">
              <h2 className="text-xl font-bold mb-4 text-[var(--text-main)]">Add New Occurrence</h2>
              <form onSubmit={handleCreateOccurrence} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[var(--text-main)]/70 mb-1">Title</label>
                  <input required type="text" placeholder="e.g. Occurrence 20" className="w-full p-3 border rounded text-sm" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[var(--text-main)]/70 mb-1">Date & Time</label>
                  <input required type="datetime-local" className="w-full p-3 border rounded text-sm font-mono" value={newDate} onChange={e => setNewDate(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[var(--text-main)]/70 mb-1">Seats</label>
                    <input type="number" className="w-full p-3 border rounded text-sm font-mono" value={newSeats} onChange={e => setNewSeats(parseInt(e.target.value))} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[var(--text-main)]/70 mb-1">Price (₹)</label>
                    <input type="number" className="w-full p-3 border rounded text-sm font-mono" value={newPrice} onChange={e => setNewPrice(parseInt(e.target.value))} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[var(--text-main)]/70 mb-1">Initial Status</label>
                  <select className="w-full p-3 border rounded text-sm" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                    <option value="collecting_interests">Collecting Interests ("I'm Interested" open)</option>
                    <option value="bookings_open">Bookings Open</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-[var(--accent-primary)] text-white p-3 rounded font-bold uppercase tracking-wider hover:bg-[#c95318]">
                  {loading ? 'Creating...' : '+ Create Occurrence'}
                </button>
              </form>
            </div>

            {/* List and manage existing */}
            <div className="col-span-1 md:col-span-2 bg-[var(--bg-primary)] p-6 rounded-xl shadow-sm border border-[var(--text-main)]/5">
              <h2 className="text-xl font-bold mb-4 text-[var(--text-main)]">Manage All Occurrences</h2>
              <div className="space-y-4">
                {occurrences.map(occ => {
                  const sold = occ.sold_seats || 0;
                  const total = occ.total_seats || 8;
                  const isSoldOut = sold >= total;
                  return (
                    <div key={occ.id} className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-heading text-xl font-bold text-[var(--text-main)]">{occ.title}</h3>
                          <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${isSoldOut ? 'bg-red-600 text-white animate-pulse' : 'bg-green-100 text-green-800'}`}>
                            {isSoldOut ? `🔴 SOLD OUT (${sold}/${total})` : `🎟️ ${sold} / ${total} Seats Sold`}
                          </span>
                        </div>
                        <p className="text-xs font-mono text-[var(--text-main)]/70 mt-1">{new Date(occ.event_date).toLocaleString()} • ₹{(occ.price_inr / 100).toLocaleString('en-IN')} • {total} total seats</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <select 
                          value={occ.status} 
                          onChange={e => handleUpdateStatus(occ.id, e.target.value)}
                          className="p-2 border rounded text-xs font-bold uppercase bg-[var(--bg-secondary)]"
                        >
                          <option value="collecting_interests">Collecting Interests</option>
                          <option value="bookings_open">Bookings Open</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: COMMUNITY WAITLIST & CSV BLAST ── */}
        {activeTab === 'community' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* CSV Uploader */}
            <div className="bg-[var(--bg-primary)] p-6 rounded-xl shadow-sm border border-[var(--text-main)]/5">
              <h2 className="text-xl font-bold mb-2 text-[var(--text-main)]">📂 Import Waitlist CSV</h2>
              <p className="text-xs text-[var(--text-main)]/70 mb-6">
                Upload your previous waitlist CSV file (columns: Name, Email, Phone, Instagram). These guests will be stored in the primary community database so you can email them whenever a new dinner is created.
              </p>
              
              <label className="border-2 border-dashed border-[var(--accent-primary)]/40 hover:border-[var(--accent-primary)] rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer bg-[var(--accent-primary)]/5 transition-colors">
                <span className="text-3xl mb-2">📄</span>
                <span className="font-bold text-sm text-[var(--text-main)]">Click to Select CSV File</span>
                <span className="text-xs text-[var(--text-main)]/60 mt-1">Accepts .csv format</span>
                <input type="file" accept=".csv" className="hidden" onChange={handleCsvUpload} disabled={loading} />
              </label>
            </div>

            {/* Announcement Blast */}
            <div className="bg-[var(--bg-primary)] p-6 rounded-xl shadow-sm border border-[var(--text-main)]/5">
              <h2 className="text-xl font-bold mb-2 text-[var(--text-main)]">📢 Broadcast Dinner Announcement</h2>
              <p className="text-xs text-[var(--text-main)]/70 mb-6">
                Send an announcement email to all <strong>{communityCount}</strong> historical waitlist members inviting them to visit the website and click "I'm Interested" for a new occurrence.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[var(--text-main)]/70 mb-1">Select Occurrence to Announce</label>
                  <select className="w-full p-2 border rounded text-sm" value={blastOccId} onChange={e => setBlastOccId(e.target.value)}>
                    <option value="">-- Choose Occurrence --</option>
                    {occurrences.map(o => <option key={o.id} value={o.id}>{o.title}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[var(--text-main)]/70 mb-1">Announcement Subject</label>
                  <input type="text" placeholder="e.g. Announcing Vantammayilu Occurrence 20" className="w-full p-2 border rounded text-sm" value={blastSubject} onChange={e => setBlastSubject(e.target.value)} />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[var(--text-main)]/70 mb-1">Announcement Poster Image</label>
                  <div className="flex gap-2">
                    <input type="url" placeholder="https://... or upload ->" className="w-full p-2 border rounded text-xs font-mono" value={blastPosterUrl} onChange={e => setBlastPosterUrl(e.target.value)} />
                    <label className="bg-[var(--text-main)] text-white px-3 py-2 rounded text-xs font-bold cursor-pointer hover:bg-black whitespace-nowrap flex items-center">
                      📁 Upload
                      <input type="file" accept="image/*" className="hidden" onChange={e => uploadImageToSupabase(e.target.files?.[0], setBlastPosterUrl)} />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[var(--text-main)]/70 mb-1">Message Note</label>
                  <textarea rows="3" placeholder="Tell your community about the new menu or dates..." className="w-full p-2 border rounded text-sm" value={blastMessage} onChange={e => setBlastMessage(e.target.value)} />
                </div>

                <button 
                  onClick={handleCommunityBlast} 
                  disabled={loading || !blastOccId || communityCount === 0}
                  className="w-full bg-[#1a1a1a] hover:bg-[var(--accent-primary)] text-white p-3 rounded font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {loading ? 'Broadcasting...' : `📢 Send Blast to All (${communityCount})`}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── GUEST DETAILS & TRACKING LINK MODAL ── */}
        {viewModalGuest && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn" onClick={(e) => e.target === e.currentTarget && setViewModalGuest(null)}>
            <div className="bg-[var(--bg-primary)] border-2 border-[var(--accent-primary)] rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative text-[var(--text-main)]">
              <button onClick={() => setViewModalGuest(null)} className="absolute top-4 right-4 text-xl font-bold hover:text-[var(--accent-primary)]">✕</button>
              
              <div className="flex items-center gap-3 mb-4 border-b border-[var(--text-main)]/10 pb-4">
                <div className="w-12 h-12 rounded-full bg-[var(--accent-primary)]/10 flex items-center justify-center font-bold text-xl text-[var(--accent-primary)]">
                  {(viewModalGuest.users?.name || 'G')[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="font-heading text-2xl font-bold">{viewModalGuest.users?.name || 'Guest'}</h3>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase inline-block mt-1 ${viewModalGuest.is_paid || viewModalGuest.status === 'PAID' || viewModalGuest.status === 'booked' ? 'bg-green-600 text-white' : 'bg-orange-100 text-orange-800'}`}>
                    {viewModalGuest.is_paid || viewModalGuest.status === 'PAID' || viewModalGuest.status === 'booked' ? `🎟️ CONFIRMED PAID (${viewModalGuest.seats || 1} SEAT)` : viewModalGuest.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-sm mb-6">
                <div className="grid grid-cols-3 gap-2 py-1 border-b border-[var(--text-main)]/5">
                  <span className="font-bold text-[var(--text-main)]/60 uppercase text-xs">Email:</span>
                  <span className="col-span-2 font-mono break-all">{viewModalGuest.users?.email}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1 border-b border-[var(--text-main)]/5">
                  <span className="font-bold text-[var(--text-main)]/60 uppercase text-xs">Phone:</span>
                  <span className="col-span-2 font-mono">{viewModalGuest.users?.phone}</span>
                </div>
                {viewModalGuest.users?.instagram_handle && (
                  <div className="grid grid-cols-3 gap-2 py-1 border-b border-[var(--text-main)]/5">
                    <span className="font-bold text-[var(--text-main)]/60 uppercase text-xs">Instagram:</span>
                    <span className="col-span-2 font-mono">@{viewModalGuest.users?.instagram_handle.replace(/^@/, '')}</span>
                  </div>
                )}
                {(viewModalGuest.is_paid || viewModalGuest.status === 'PAID' || viewModalGuest.status === 'booked') && (
                  <>
                    <div className="grid grid-cols-3 gap-2 py-1 border-b border-[var(--text-main)]/5">
                      <span className="font-bold text-[var(--text-main)]/60 uppercase text-xs">Token Badge:</span>
                      <span className="col-span-2 font-bold text-[var(--accent-primary)]">{viewModalGuest.token_name || 'The Curious One'}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 py-1 border-b border-[var(--text-main)]/5">
                      <span className="font-bold text-[var(--text-main)]/60 uppercase text-xs">Order ID:</span>
                      <span className="col-span-2 font-mono text-xs">{viewModalGuest.razorpay_order_id || 'N/A'}</span>
                    </div>
                    {viewModalGuest.customer_query && (
                      <div className="grid grid-cols-3 gap-2 py-1 border-b border-[var(--text-main)]/5">
                        <span className="font-bold text-[var(--text-main)]/60 uppercase text-xs">Dietary Notes:</span>
                        <span className="col-span-2 italic bg-[var(--accent-primary)]/5 p-2 rounded border border-[var(--accent-primary)]/20">{viewModalGuest.customer_query}</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="bg-[var(--bg-secondary)] p-4 rounded-xl border border-[var(--text-main)]/10">
                <label className="block text-xs font-bold uppercase tracking-widest text-[var(--text-main)]/70 mb-1 flex items-center justify-between">
                  <span>🔗 Guest's Private Magic Link</span>
                  <span className="text-[10px] text-[var(--accent-primary)] font-normal">Trackable Access URL</span>
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    readOnly 
                    value={viewModalGuest.magic_link || ''} 
                    className="w-full p-2 bg-[var(--bg-primary)] border rounded font-mono text-xs text-[var(--text-main)]/80 select-all" 
                  />
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(viewModalGuest.magic_link || '');
                      alert('✅ Tracking Link copied to clipboard!');
                    }}
                    className="bg-[var(--accent-primary)] hover:bg-[#c14a27] text-white px-4 py-2 rounded text-xs font-bold whitespace-nowrap transition-all shadow"
                  >
                    📋 Copy Link
                  </button>
                </div>
                <p className="text-[11px] text-[var(--text-main)]/60 mt-2 italic">
                  Sharing this exact URL allows this guest to bypass the public waitlist and immediately access the reservation page for this dinner.
                </p>
              </div>

              <div className="mt-6 text-right">
                <button onClick={() => setViewModalGuest(null)} className="bg-[var(--text-main)] hover:bg-black text-white px-6 py-2 rounded-lg font-bold text-sm">
                  Close Window
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
