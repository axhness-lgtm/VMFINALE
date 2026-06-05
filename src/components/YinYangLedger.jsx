import React, { useState } from 'react';
import './YinYangLedger.css';

const YinYangLedger = () => {
  const [isBottomHovered, setIsBottomHovered] = useState(false);

  const marqueeText = "+ 100% Secure Registry + Live Protocol Activation + Chapter 04: Oaxaca ";
  const repeatedText = Array(4).fill(marqueeText).join(" ");

  const rows = [
    { time: "00:17:40", userId: "User_331", action: "Contributed to Thread", node: "Node_07", status: "Confirmed" },
    { time: "00:17:41", userId: "User_902", action: "Uploaded Ledger Vol 04", node: "Node_03", status: "Verified" },
    { time: "00:17:42", userId: "User_117", action: "Joined Community", node: "Node_02", status: "Confirmed" },
    { time: "00:17:43", userId: "User_564", action: "Commented on Post", node: "Node_08", status: "Confirmed" },
    { time: "00:17:44", userId: "User_982", action: "Received Badge Access", node: "Node_01", status: "Verified" },
    { time: "00:17:45", userId: "User_221", action: "Updated Profile Data", node: "Node_05", status: "Confirmed" },
    { time: "00:17:46", userId: "User_809", action: "Contributed to Ledger", node: "Node_04", status: "Verified" },
    { time: "00:17:47", userId: "User_331", action: "Replied to Comment", node: "Node_08", status: "Confirmed" }
  ];

  return (
    <section className={`yin-yang-ledger ${isBottomHovered ? 'is-hovered' : ''}`}>
      {/* Top Half (The Archive) */}
      <div className="ledger-top-half">
        <h2 className="ledger-title">THE SEAT DOCKET</h2>
      </div>

      {/* Marquee Ribbons (Sandwiched exactly between the two halves) */}
      <div className="marquee-ribbon-sandwich">
        {/* Ribbon 1: Leftward Scroll */}
        <div className="marquee-ribbon ribbon-1">
          <div className="marquee-track">
            <span className="marquee-text-content">{repeatedText}</span>
            <span className="marquee-text-content">{repeatedText}</span>
          </div>
        </div>

        {/* Ribbon 2: Rightward Scroll */}
        <div className="marquee-ribbon ribbon-2">
          <div className="marquee-track">
            <span className="marquee-text-content">{repeatedText}</span>
            <span className="marquee-text-content">{repeatedText}</span>
          </div>
        </div>

        {/* Ribbon 3: Leftward Scroll */}
        <div className="marquee-ribbon ribbon-3">
          <div className="marquee-track">
            <span className="marquee-text-content">{repeatedText}</span>
            <span className="marquee-text-content">{repeatedText}</span>
          </div>
        </div>
      </div>

      {/* Bottom Half (The Interface) */}
      <div
        className="ledger-bottom-half"
        onMouseEnter={() => setIsBottomHovered(true)}
        onMouseLeave={() => setIsBottomHovered(false)}
      >
        <div className="terminal-feed-container">
          <div className="terminal-feed-header">
            <div className="header-left">&gt;_ Activity Feed // System Online</div>
            <div className="header-right">
              <span className="header-filter">Filter: All</span>
              <span className="header-count">Count: 2,341</span>
            </div>
          </div>
          
          <div className="terminal-feed-body">
            <div className="terminal-table-wrapper">
              <table className="terminal-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>User ID</th>
                    <th>Action</th>
                    <th>Node</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.time}</td>
                      <td>{row.userId}</td>
                      <td>{row.action}</td>
                      <td>{row.node}</td>
                      <td>{row.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="terminal-prompt">
              &gt;_ <span className="cursor-block">█</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default YinYangLedger;
