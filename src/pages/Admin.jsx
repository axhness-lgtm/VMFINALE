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
  const [communityCount, setCommunityCount] = useState(0);
  const [communityList, setCommunityList] = useState([]);
  const [manualEmails, setManualEmails] = useState('');
  const [uploadTag, setUploadTag] = useState('VIP Waitlist');
  const [listFilterTag, setListFilterTag] = useState('ALL');

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
      const res = await fetch('/api/admin/community');
      const data = await res.json();
      if (data.success) setCommunityCount(data.count);

      const listRes = await fetch('/api/admin/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'list', password: password || 'Hyndavio@1001' })
      });
      const listData = await listRes.json();
      if (listData.success && Array.isArray(listData.users)) setCommunityList(listData.users);
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
        body: JSON.stringify({ occurrence_id: occurrenceId, password: password || 'Hyndavio@1001' })
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

  useEffect(() => {
    if (!isAuthenticated || !selectedOccurrenceId || activeTab !== 'dispatch') return;
    const interval = setInterval(() => {
      fetch('/api/admin/get-interests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ occurrence_id: selectedOccurrenceId, password: password || 'Hyndavio@1001' })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.interests) {
          setInterests(data.interests);
        }
      })
      .catch(() => {});
      fetchOccurrences();
    }, 10000);
    return () => clearInterval(interval);
  }, [isAuthenticated, selectedOccurrenceId, activeTab, password]);

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
      const res = await fetch('/api/occurrences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
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
      const res = await fetch('/api/occurrences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', id, status, password })
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
            instagram: instaIdx !== -1 ? cols[instaIdx] : null,
            tag: uploadTag.trim() || 'General'
          });
        }
      }

      setLoading(true);
      try {
        const res = await fetch('/api/admin/community', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'upload', users: parsedUsers, password })
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

  const handleManualUpload = async () => {
    if (!manualEmails.trim()) return alert('Please paste at least one email address.');
    const rawList = manualEmails.split(/[\r\n,; ]+/).map(e => e.trim()).filter(e => e.includes('@'));
    if (rawList.length === 0) return alert('No valid emails found in pasted text.');

    const parsedUsers = rawList.map(email => ({
      name: email.split('@')[0],
      email: email.toLowerCase(),
      phone: 'N/A',
      tag: uploadTag.trim() || 'General'
    }));

    setLoading(true);
    try {
      const res = await fetch('/api/admin/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'upload', users: parsedUsers, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.details || data.error);
      alert('🎉 ' + data.message);
      setManualEmails('');
      fetchCommunityCount();
    } catch (err) {
      alert('Error bulk adding emails: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCommunityBlast = async () => {
    if (!blastOccId) return alert('Please select an occurrence to announce.');
    if (!confirm(`Are you sure you want to send an announcement email to all ${communityCount} community members?`)) return;

    setLoading(true);
    try {
      const res = await fetch('/api/admin/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'blast',
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
                {(occurrences || []).map(occ => {
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
                        <span className="px-2 py-0.5 rounded bg-[var(--text-main)]/5 text-[var(--accent-primary)]">{(occ.status || 'closed').replace(/_/g, ' ')}</span>
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
              ) : (
                (() => {
                  const currOcc = occurrences.find(o => o.id === selectedOccurrenceId) || {};
                  const totalSeats = currOcc.total_seats || 8;
                  const confirmedGuests = interests.filter(i => i.is_paid === true || i.status === 'PAID' || i.status === 'booked' || i.status === 'confirmed');
                  const waitlistGuests = interests.filter(i => !(i.is_paid === true || i.status === 'PAID' || i.status === 'booked' || i.status === 'confirmed'));
                  const seatsSold = confirmedGuests.reduce((sum, g) => sum + (g.seats || 1), 0);

                  return (
                    <div className="space-y-8">
                      {/* Top Summary Widget */}
                      <div className="p-6 bg-[var(--accent-primary)]/10 border-2 border-[var(--accent-primary)] rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
                        <div>
                          <h3 className="font-heading text-2xl font-bold text-[var(--accent-primary)] flex items-center gap-2">
                            <span>🎟️ REAL-TIME CONFIRMED SEATS SOLD</span>
                          </h3>
                          <p className="text-sm font-body text-[var(--text-main)]/80 mt-1">
                            Live dynamic count of seats paid and confirmed for <strong>{currOcc.title || 'Selected Dinner'}</strong>.
                          </p>
                        </div>
                        <div className="text-center bg-white px-6 py-3 rounded-xl border border-[var(--accent-primary)]/30 shadow">
                          <span className="text-3xl font-mono font-black text-[var(--accent-primary)]">{seatsSold}</span>
                          <span className="text-xl font-mono font-bold text-[var(--text-main)]/60"> / {totalSeats}</span>
                          <div className="text-[10px] uppercase font-bold text-[var(--text-main)]/60 tracking-wider mt-0.5">Seats Booked</div>
                        </div>
                      </div>

                      {/* Confirmed Guests Table */}
                      <div>
                        <h3 className="text-lg font-bold text-[var(--text-main)] mb-3 flex items-center gap-2">
                          <span className="bg-green-600 text-white w-6 h-6 rounded-full inline-flex items-center justify-center text-xs">✓</span>
                          <span>Confirmed Dinner Guests (Paid & Secured)</span>
                        </h3>
                        {confirmedGuests.length === 0 ? (
                          <p className="text-sm text-[var(--text-main)]/50 italic bg-[var(--bg-secondary)] p-4 rounded-lg border border-[var(--text-main)]/5">No confirmed bookings yet. As guests complete payment, they will instantly appear here.</p>
                        ) : (
                          <div className="overflow-x-auto bg-[var(--bg-secondary)] rounded-xl border border-green-600/30 p-2 shadow-inner">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="border-b border-[var(--text-main)]/10 text-[11px] uppercase tracking-wider text-[var(--text-main)]/60">
                                  <th className="py-2.5 px-3">Guest Name</th>
                                  <th className="py-2.5 px-3">Contact info</th>
                                  <th className="py-2.5 px-3">Token Identity</th>
                                  <th className="py-2.5 px-3">Seats</th>
                                  <th className="py-2.5 px-3">Order ID</th>
                                  <th className="py-2.5 px-3">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(confirmedGuests || []).map(item => {
                                  const u = item.users || {};
                                  return (
                                    <tr key={item.id} className="border-b border-[var(--text-main)]/5 hover:bg-white/50 font-body text-sm">
                                      <td className="py-3 px-3 font-bold text-green-800">{u.name}</td>
                                      <td className="py-3 px-3 text-xs font-mono">{u.email}<br/>{u.phone}</td>
                                      <td className="py-3 px-3"><span className="bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] font-bold px-2 py-1 rounded text-xs">{item.token_name || 'The Curious One'}</span></td>
                                      <td className="py-3 px-3 font-mono font-bold text-base">{item.seats || 1}</td>
                                      <td className="py-3 px-3 text-[11px] font-mono text-[var(--text-main)]/70">{item.razorpay_order_id || 'N/A'}</td>
                                      <td className="py-3 px-3">
                                        <button onClick={() => setViewModalGuest(item)} className="bg-white hover:bg-[var(--accent-primary)] hover:text-white text-[var(--text-main)] px-3 py-1 rounded border border-[var(--text-main)]/20 text-xs font-bold transition-all shadow-sm">
                                          👁️ View Details
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

                      {/* Waitlist Guests Table */}
                      <div>
                        <h3 className="text-lg font-bold text-[var(--text-main)] mb-3 flex items-center gap-2">
                          <span>⏳ Waitlist & Interested Guests</span>
                        </h3>
                        {waitlistGuests.length === 0 ? (
                          <p className="text-sm text-[var(--text-main)]/50 italic bg-[var(--bg-secondary)] p-4 rounded-lg border border-[var(--text-main)]/5">No unconfirmed waitlist guests.</p>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="border-b border-[var(--text-main)]/10 text-xs uppercase tracking-widest text-[var(--text-main)]/50">
                                  <th className="py-3 px-3">Select</th>
                                  <th className="py-3 px-3">Guest</th>
                                  <th className="py-3 px-3">Contact</th>
                                  <th className="py-3 px-3">Status</th>
                                  <th className="py-3 px-3">Link</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(waitlistGuests || []).map(item => {
                                  const u = item.users || {};
                                  return (
                                    <tr key={item.id} className="border-b border-[var(--text-main)]/5 hover:bg-[var(--text-main)]/5 text-sm">
                                      <td className="py-3 px-3">
                                        <input 
                                          type="checkbox" 
                                          checked={selectedUsers.has(u.id)}
                                          onChange={() => toggleUserSelection(u.id)}
                                          className="w-4 h-4 accent-[var(--accent-primary)]"
                                        />
                                      </td>
                                      <td className="py-3 px-3 font-bold">{u.name}</td>
                                      <td className="py-3 px-3 text-xs font-mono">{u.email}<br/>{u.phone}</td>
                                      <td className="py-3 px-3">
                                        <span className="px-2.5 py-1 rounded text-xs uppercase font-extrabold tracking-wider bg-orange-100 text-orange-800">
                                          {(item.status || 'pending').replace(/_/g, ' ')}
                                        </span>
                                      </td>
                                      <td className="py-3 px-3">
                                        <button onClick={() => setViewModalGuest(item)} className="bg-[var(--bg-secondary)] hover:bg-[var(--accent-primary)] hover:text-white text-[var(--text-main)] px-3 py-1.5 rounded border border-[var(--text-main)]/20 text-xs font-bold transition-all shadow-sm">
                                          👁️ View & Link
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
                  );
                })()
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
                {(occurrences || []).map(occ => {
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
          <div className="space-y-8">
            {/* Top row: Upload / Paste & Broadcast */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Bulk Uploader / Paste */}
              <div className="bg-[var(--bg-primary)] p-6 rounded-xl shadow-sm border border-[var(--text-main)]/5 space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-1 text-[var(--text-main)]">📥 Bulk Add Waitlist Emails</h2>
                  <p className="text-xs text-[var(--text-main)]/70">
                    Paste raw email addresses or upload a CSV file. Segregate your lists using tags.
                  </p>
                </div>

                {/* Segregation Filter input */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[var(--accent-primary)] mb-1">
                    🏷️ List Tag / Segregation Filter
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. VIP Waitlist, Instagram Leads, Batch 1" 
                    className="w-full p-2.5 border border-[var(--accent-primary)]/40 rounded text-sm font-bold bg-[var(--accent-primary)]/5 text-[var(--text-main)]" 
                    value={uploadTag} 
                    onChange={e => setUploadTag(e.target.value)} 
                  />
                  <p className="text-[11px] text-[var(--text-main)]/50 mt-1 italic">All emails added below will be assigned this segregation tag.</p>
                </div>

                {/* Manual Paste */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-[var(--text-main)]/70">
                    Paste Emails (Separated by commas, spaces, or newlines)
                  </label>
                  <textarea 
                    rows="3" 
                    placeholder="guest1@gmail.com, guest2@yahoo.com..." 
                    className="w-full p-3 border rounded text-sm font-mono bg-[var(--bg-secondary)]"
                    value={manualEmails}
                    onChange={e => setManualEmails(e.target.value)}
                  />
                  <button 
                    onClick={handleManualUpload} 
                    disabled={loading || !manualEmails.trim()}
                    className="w-full bg-[var(--text-main)] hover:bg-black text-white p-2.5 rounded font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Adding...' : '+ Add Pasted Emails to List'}
                  </button>
                </div>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-[var(--text-main)]/10"></div>
                  <span className="flex-shrink mx-4 text-xs font-bold text-[var(--text-main)]/40 uppercase">OR CSV IMPORT</span>
                  <div className="flex-grow border-t border-[var(--text-main)]/10"></div>
                </div>

                {/* CSV Uploader */}
                <label className="border-2 border-dashed border-[var(--text-main)]/20 hover:border-[var(--accent-primary)] rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer bg-[var(--bg-secondary)] transition-colors">
                  <span className="text-2xl mb-1">📄</span>
                  <span className="font-bold text-xs text-[var(--text-main)]">Click to Upload CSV File</span>
                  <span className="text-[10px] text-[var(--text-main)]/50 mt-0.5">Columns: Name, Email, Phone, Instagram</span>
                  <input type="file" accept=".csv" className="hidden" onChange={handleCsvUpload} disabled={loading} />
                </label>
              </div>

              {/* Announcement Blast */}
              <div className="bg-[var(--bg-primary)] p-6 rounded-xl shadow-sm border border-[var(--text-main)]/5 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-2 text-[var(--text-main)]">📢 Broadcast Dinner Announcement</h2>
                  <p className="text-xs text-[var(--text-main)]/70 mb-6">
                    Send an announcement email to all <strong>{communityCount}</strong> waitlist members inviting them to visit the website and click "I'm Interested".
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-[var(--text-main)]/70 mb-1">Select Occurrence to Announce</label>
                      <select className="w-full p-2 border rounded text-sm" value={blastOccId} onChange={e => setBlastOccId(e.target.value)}>
                        <option value="">-- Choose Occurrence --</option>
                        {(occurrences || []).map(o => <option key={o.id} value={o.id}>{o.title}</option>)}
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
                  </div>
                </div>

                <button 
                  onClick={handleCommunityBlast} 
                  disabled={loading || !blastOccId || communityCount === 0}
                  className="w-full mt-6 bg-[#1a1a1a] hover:bg-[var(--accent-primary)] text-white p-3 rounded font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {loading ? 'Broadcasting...' : `📢 Send Blast to All (${communityCount})`}
                </button>
              </div>
            </div>

            {/* Segregated Community Directory Table */}
            <div className="bg-[var(--bg-primary)] p-6 rounded-xl shadow-sm border border-[var(--text-main)]/5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-[var(--text-main)]/10 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-[var(--text-main)]">👥 Community Waitlist Directory ({communityList.length})</h2>
                  <p className="text-xs text-[var(--text-main)]/60">Filter and view all guests added via manual paste or CSV.</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs font-bold uppercase text-[var(--text-main)]/60 whitespace-nowrap">Filter Tag:</span>
                  <select 
                    className="p-2 border rounded text-xs font-bold bg-[var(--bg-secondary)] w-full sm:w-48"
                    value={listFilterTag}
                    onChange={e => setListFilterTag(e.target.value)}
                  >
                    <option value="ALL">All Segregation Tags ({(communityList || []).length})</option>
                    {Array.from(new Set((communityList || []).map(u => {
                      const handle = u.instagram_handle || '';
                      const match = handle.match(/^\[Tag:\s*(.*?)\]/i);
                      return match ? match[1] : 'Untagged / General';
                    }))).filter(Boolean).map(tag => (
                      <option key={tag} value={tag}>{tag}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[var(--text-main)]/10 text-xs uppercase tracking-widest text-[var(--text-main)]/50 sticky top-0 bg-[var(--bg-primary)]">
                      <th className="py-3 px-3">Name</th>
                      <th className="py-3 px-3">Email</th>
                      <th className="py-3 px-3">Segregation Tag</th>
                      <th className="py-3 px-3">Phone / Info</th>
                      <th className="py-3 px-3">Added Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(communityList || [])
                      .filter(u => {
                        if (listFilterTag === 'ALL') return true;
                        const handle = u.instagram_handle || '';
                        const match = handle.match(/^\[Tag:\s*(.*?)\]/i);
                        const tag = match ? match[1] : 'Untagged / General';
                        return tag === listFilterTag;
                      })
                      .map(u => {
                        const handle = u.instagram_handle || '';
                        const match = handle.match(/^\[Tag:\s*(.*?)\]/i);
                        const tag = match ? match[1] : 'General';
                        const cleanHandle = handle.replace(/^\[Tag:\s*.*?\]\s*/i, '');
                        return (
                          <tr key={u.id} className="border-b border-[var(--text-main)]/5 hover:bg-[var(--text-main)]/5">
                            <td className="py-3 px-3 font-bold">{u.name}</td>
                            <td className="py-3 px-3 font-mono text-xs">{u.email}</td>
                            <td className="py-3 px-3">
                              <span className="px-2.5 py-1 rounded text-xs font-bold uppercase bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20">
                                🏷️ {tag}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-xs font-mono text-[var(--text-main)]/70">{cleanHandle || u.phone || 'N/A'}</td>
                            <td className="py-3 px-3 text-xs text-[var(--text-main)]/50">{new Date(u.created_at).toLocaleDateString()}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
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
                    {viewModalGuest.is_paid || viewModalGuest.status === 'PAID' || viewModalGuest.status === 'booked' ? `🎟️ CONFIRMED PAID (${viewModalGuest.seats || 1} SEAT)` : (viewModalGuest.status || 'pending').replace(/_/g, ' ')}
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
                    <span className="col-span-2 font-mono">@{(viewModalGuest.users?.instagram_handle || 'N/A').replace(/^@/, '')}</span>
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
