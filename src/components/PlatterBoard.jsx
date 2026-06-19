import React, { useState, useRef, useEffect } from 'react';
import PlatterTelemetryWorkspace from './PlatterTelemetryWorkspace';
import './PlatterBoard.css';

// 1. Data Map for Telemetry Points & Labels
const PLATTER_NODES = [
  { id: 'SWEET_START', label: 'DESSERT_POP', cx: 110, cy: 130, tx: 50, ty: 250, category: 'SWEET', details: 'QTY: 06 // CAL: 320 // TYPE: SWEET' },
  { id: 'CRUNCH_LAYER', label: 'FRY_STACK', cx: 335, cy: 260, tx: 300, ty: 125, category: 'CRUNCH', details: 'TEMP: 62.4°C // CRISP: MAXIMUM' },
  { id: 'GREENS', label: 'CELERY', cx: 480, cy: 250, tx: 470, ty: 125, category: 'VEG', details: 'SOURCE: LOCAL ECO_FARM' },
  { id: 'HEAT_ZONE', label: 'WINGS', cx: 550, cy: 260, tx: 570, ty: 125, category: 'HEAT', details: 'TEMP: 74.1°C // CORE: HOT' },
  { id: 'PROTEIN_UNIT', label: 'BONELESS', cx: 680, cy: 300, tx: 670, ty: 125, category: 'MEAT', details: 'PREP: SPICED BATCH_04' },
  { id: 'COOLANT', label: 'DIP_RANCH', cx: 740, cy: 240, tx: 770, ty: 125, category: 'COLD', details: 'TEMP: 4.2°C // BASE: DAIRY' },
  { id: 'BREAD_STACK', label: 'NAAN_CUT', cx: 900, cy: 260, tx: 870, ty: 125, category: 'CARB', details: 'STYLE: HEARTH FLIPPED' },
  { id: 'DIP_NODE_01', label: 'HUMMUS', cx: 385, cy: 440, tx: 215, ty: 330, category: 'COLD', details: 'OIL: EXTRA_VIRGIN OLIVE' },
  { id: 'DIP_NODE_02', label: 'CHEESE_SAUCE', cx: 300, cy: 580, tx: 215, ty: 715, category: 'HEAT', details: 'TEMP: 52.0°C // EMULSION: STABLE' },
  { id: 'DIP_NODE_03', label: 'YOGURT_DILL', cx: 435, cy: 700, tx: 380, ty: 810, category: 'COLD', details: 'HERB: FRESH HARVEST' },
  { id: 'DIP_NODE_04', label: 'SALSA_VERDE', cx: 520, cy: 615, tx: 540, ty: 730, category: 'ACID', details: 'BASE: CHARRED TOMATILLO' },
  { id: 'DIP_NODE_05', label: 'SALSA_ROJA', cx: 505, cy: 520, tx: 565, ty: 495, category: 'SPICE', details: 'INDEX: 4,500 SCOVILLE' },
  { id: 'SWEET_BLOCK', label: 'MARSHMALLOW', cx: 680, cy: 550, tx: 660, ty: 460, category: 'SWEET', details: 'SURFACE: TOASTED ALIGN' },
  { id: 'HEAT_CORE', label: 'TOASTED', cx: 770, cy: 550, tx: 750, ty: 460, category: 'HEAT', details: 'TEMP: 88.5°C // CAST_IRON_BASE' },
  { id: 'FRUIT_UNIT', label: 'STRAWBERRY', cx: 855, cy: 515, tx: 870, ty: 460, category: 'SWEET', details: 'CUT: HALVED // FRESH_RESERVE' },
  { id: 'SPREAD_NODE', label: 'CHOCOLATE', cx: 870, cy: 590, tx: 920, ty: 550, category: 'SWEET', details: 'CACAO: 72% GENUINE' },
  { id: 'CRUNCH_UNIT', label: 'GRAHAM_CRACKER', cx: 680, cy: 640, tx: 660, ty: 765, category: 'CRUNCH', details: 'TYPE: HONEY HONED BAKED' },
  { id: 'DARK_LAYER', label: 'COOKIE_STACK', cx: 755, cy: 665, tx: 765, ty: 765, category: 'SWEET', details: 'BATCH: OVEN RUN #12' },
  { id: 'SWEET_BAR', label: 'CHOCOLATE_BAR', cx: 865, cy: 665, tx: 870, ty: 765, category: 'SWEET', details: 'FORM: GRID PRESSED BLOCK' }
];

export default function PlatterBoard() {
  const [activeNode, setActiveNode] = useState(null);
  const [systemTime, setSystemTime] = useState('19:30:00');
  const svgRef = useRef(null);

  // Real-time system timer update
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setSystemTime(now.toTimeString().split(' ')[0]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="platter-system-container archival-canvas">
      {/* 2. Top Administrative Header Block */}
      <div className="platter-header-grid">
        <div className="header-left border-box">
          <span className="monospace-tag">PLATTER_PROTOCOL // 04</span>
          <h1 className="display-serif-title">THE COMMUNITY BOARD</h1>
          <p className="monospace-sub">CURATED FOR THE TABLE // BUILT FOR SHARING</p>
        </div>
        <div className="header-center border-box">
          <span className="monospace-tag">SYSTEM_STATUS</span>
          <div className="status-row">
            <span className="status-label font-body italicwritten">[ STABLE ]</span>
            <span className="status-indicator-dot pulsing"></span>
          </div>
          <span className="monospace-tag telemetry-data">TEMP: 37.2°C</span>
        </div>
        <div className="header-right border-box">
          <span className="monospace-tag">BATCH_ID // <span className="font-body italicwritten">[ PLTR_2024_04 ]</span></span>
          <div className="status-row">
            <span className="monospace-tag">SERVE_MODE // <span className="font-body italicwritten">[ FAMILY_STYLE ]</span></span>
            <span className="status-indicator-square"></span>
          </div>
        </div>
      </div>

      {/* 3. Master Interactive Blueprint Workspace Canvas */}
      <div className="blueprint-workspace">
        <PlatterTelemetryWorkspace 
          activeNode={activeNode} 
          setActiveNode={setActiveNode} 
        />

        {/* Fixed Structural Side-Cards */}
        <div className="fixed-card sauce-matrix-card">
          <div className="card-title">SAUCE_MATRIX</div>
          <ul>
            <li>• CHOCOLATE <span className="inline-square"></span></li>
            <li>• CARAMEL <span className="inline-square"></span></li>
            <li>• BERRY_COMP. <span className="inline-square"></span></li>
          </ul>
        </div>

        <div className="fixed-card archive-note-card">
          <div className="card-title">ARCHIVE_NOTE</div>
          <p>FOOD IS MEMORY.</p>
          <p>SHARED IS SACRED. <span className="inline-square"></span></p>
        </div>
      </div>

      {/* 5. Bottom System Logs Ledger Footer */}
      <div className="platter-footer-grid">
        <div className="footer-block border-box">
          <span className="monospace-tag-label">INGREDIENT_LOG</span>
          <p className="monospace-log-line">SOURCE: LOCAL // SEASONAL // ETHICAL</p>
          <p className="monospace-log-line">PREPARED: WITH INTENTION</p>
          <p className="monospace-log-line">SERVED: WITH RESPECT <span className="inline-square"></span></p>
        </div>
        <div className="footer-block border-box">
          <span className="monospace-tag-label">NUTRITION_MATRIX</span>
          <p className="monospace-log-line">PROTEIN: HIGH</p>
          <p className="monospace-log-line">CARBS: BALANCED</p>
          <p className="monospace-log-line">LOVE: MAXIMUM <span className="inline-square"></span></p>
        </div>
        <div className="footer-block border-box">
          <span className="monospace-tag-label">ALLERGY_NOTICE</span>
          <p className="monospace-log-line error-text">PLEASE INFORM SERVER</p>
          <p className="monospace-log-line error-text">OF ANY ALLERGIES. <span className="inline-square"></span></p>
        </div>
        <div className="footer-block border-box">
          <span className="monospace-tag-label">TABLE_PROTOCOL</span>
          <p className="monospace-log-line">SHARE FREELY.</p>
          <p className="monospace-log-line">EAT MINDFULLY.</p>
          <p className="monospace-log-line">HONOR THE TABLE. <span className="inline-square"></span></p>
        </div>

        {/* Dynamic Telemetry Real-time System Stamp Panel */}
        <div className="footer-stamp-block border-box orange-invert">
          <div className="stamp-left">
            <span className="monospace-tag-label">ARCHIVE_STAMP</span>
            <div className="manifest-header font-body italicwritten">[ PLATTER_VERIFIED ]</div>
            <div className="timestamp-data">DATE: 2024-03-11  TIME: {systemTime}</div>
            <div className="timestamp-data">BY: THE_SEAT // COMMUNITY_ARCHIVE</div>
          </div>
          <div className="stamp-right">
            <svg viewBox="0 0 100 100" className="stamp-vector-reticle">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#efe9e1" strokeWidth="1.5" strokeDasharray="4 2"/>
              <circle cx="50" cy="50" r="15" fill="none" stroke="#efe9e1" strokeWidth="2"/>
              <line x1="50" y1="5" x2="50" y2="95" stroke="#efe9e1" strokeWidth="1"/>
              <line x1="5" y1="50" x2="95" y2="50" stroke="#efe9e1" strokeWidth="1"/>
              <polygon points="50,30 55,50 50,55 45,50" fill="#efe9e1"/>
            </svg>
          </div>
        </div>
      </div>

      {/* 6. Active Node HUD Telemetry Panel */}
      {activeNode && (
        <div className="live-hud-ticker">
          <span className="ticker-alert">LOG_ALERT //</span>
          <span className="ticker-body">TARGET: {activeNode.id} // PARAMETER: {activeNode.details} // LAYER: {activeNode.category}</span>
          <span className="ticker-cursor">█</span>
        </div>
      )}
    </div>
  );
}
