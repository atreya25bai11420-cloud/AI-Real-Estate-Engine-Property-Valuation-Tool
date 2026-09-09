import React, { useState } from 'react';

export default function App() {
  const [zipCode, setZipCode] = useState('');
  const [sqFt, setSqFt] = useState(1200);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(true);

  const fetchValuation = async (zip, area) => {
    if (!zip.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`http://localhost:5000/api/valuation?zipCode=${encodeURIComponent(zip)}&sqFt=${area}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch valuation');
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchValuation(zipCode, sqFt);
  };

  const handleSqFtChange = (e) => {
    const newArea = Number(e.target.value);
    setSqFt(newArea);
    if (zipCode.trim() && result) {
      fetchValuation(zipCode, newArea);
    }
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const theme = darkMode ? {
    bg: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #311042 100%)',
    cardBg: 'rgba(30, 41, 59, 0.85)',
    cardBorder: '1px solid rgba(255, 255, 255, 0.12)',
    textPrimary: '#ffffff',
    textSecondary: '#94a3b8',
    inputBg: '#0f172a',
    inputBorder: '#475569',
    inputText: '#ffffff',
    resultBg: 'linear-gradient(180deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)',
    boxBg: 'rgba(51, 65, 85, 0.5)',
    toggleBtnBg: '#334155',
    toggleBtnText: '#f8fafc'
  } : {
    bg: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 50%, #e2e8f0 100%)',
    cardBg: 'rgba(255, 255, 255, 0.92)',
    cardBorder: '1px solid #cbd5e1',
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    inputBg: '#f8fafc',
    inputBorder: '#cbd5e1',
    inputText: '#0f172a',
    resultBg: 'linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%)',
    boxBg: '#ffffff',
    toggleBtnBg: '#e2e8f0',
    toggleBtnText: '#0f172a'
  };

  return (
    <>
      {/* Hide controls when printing to PDF */}
      <style>{`
        @media print {
          body { background: #ffffff !important; color: #000000 !important; }
          .no-print { display: none !important; }
          .print-card { 
            box-shadow: none !important; 
            border: 1px solid #000 !important; 
            background: #ffffff !important; 
            color: #000000 !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          .print-box {
            background: #f8fafc !important;
            border: 1px solid #cbd5e1 !important;
            color: #000000 !important;
          }
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: theme.bg,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        color: theme.textPrimary,
        transition: 'all 0.3s ease'
      }}>
        <div className="print-card" style={{
          width: '100%',
          maxWidth: '540px',
          background: theme.cardBg,
          backdropFilter: 'blur(16px)',
          borderRadius: '24px',
          border: theme.cardBorder,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          padding: '32px',
          position: 'relative'
        }}>
          {/* Day / Night Mode Toggle */}
          <button
            className="no-print"
            onClick={() => setDarkMode(!darkMode)}
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              background: theme.toggleBtnBg,
              color: theme.toggleBtnText,
              border: 'none',
              padding: '8px 14px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}
          >
            {darkMode ? '☀️ Day Mode' : '🌙 Night Mode'}
          </button>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px', marginTop: '8px' }}>
            <span style={{
              background: 'linear-gradient(90deg, #38bdf8, #818cf8, #c084fc)',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '700',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: '#ffffff'
            }}>
              AI Real Estate Engine
            </span>
            <h1 style={{ fontSize: '28px', fontWeight: '800', marginTop: '12px', marginBottom: '6px' }}>
              Property Valuation
            </h1>
            <p style={{ color: theme.textSecondary, fontSize: '14px', margin: 0 }}>
              Instant AI market analytics & dataset estimation
            </p>
          </div>

          {/* Input Form */}
          <form className="no-print" onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: theme.textSecondary, marginBottom: '8px' }}>
                Pincode / ZIP Code
              </label>
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="e.g. 560001 or 400001"
                required
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: `1px solid ${theme.inputBorder}`,
                  background: theme.inputBg,
                  color: theme.inputText,
                  fontSize: '15px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: theme.textSecondary }}>
                  Property Area
                </label>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#0284c7' }}>
                  {Number(sqFt).toLocaleString()} Sq. Ft.
                </span>
              </div>
              <input
                type="range"
                min="300"
                max="10000"
                step="50"
                value={sqFt}
                onChange={handleSqFtChange}
                style={{ width: '100%', accentColor: '#818cf8', cursor: 'pointer' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(90deg, #6366f1 0%, #a855f7 100%)',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 10px 20px -5px rgba(168, 85, 247, 0.4)'
              }}
            >
              {loading ? 'Calculating Valuation...' : 'Calculate Property Value'}
            </button>
          </form>

          {/* Error Notification */}
          {error && (
            <div className="no-print" style={{
              marginTop: '20px',
              padding: '14px',
              borderRadius: '12px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #ef4444',
              color: '#ef4444',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          {/* Valuation Result Display */}
          {result && (
            <div style={{
              marginTop: '24px',
              padding: '20px',
              borderRadius: '16px',
              background: theme.resultBg,
              border: '1px solid #3b82f6'
            }}>
              {result.isNearest && (
                <div style={{
                  background: 'rgba(245, 158, 11, 0.2)',
                  border: '1px solid #f59e0b',
                  color: darkMode ? '#fef08a' : '#b45309',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  marginBottom: '16px',
                  textAlign: 'center'
                }}>
                  📍 Code '{result.requestedZip}' not found. Using nearest area code <strong>{result.matchedZip}</strong>.
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <span style={{ fontSize: '12px', color: theme.textSecondary, textTransform: 'uppercase' }}>Location</span>
                  <h3 style={{ margin: 0, fontSize: '18px' }}>{result.city} ({result.matchedZip})</h3>
                </div>
                <span style={{
                  background: '#0284c7',
                  color: '#ffffff',
                  padding: '6px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '700'
                }}>
                  {result.inventoryCount} Properties Active
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="print-box" style={{ background: theme.boxBg, padding: '14px', borderRadius: '12px', border: `1px solid ${theme.inputBorder}` }}>
                  <span style={{ fontSize: '12px', color: theme.textSecondary }}>Avg Rate / Sq. Ft.</span>
                  <p style={{ margin: '4px 0 0 0', fontSize: '18px', fontWeight: '700', color: '#0284c7' }}>
                    ₹{Number(result.avgPricePerSqFt).toLocaleString()}
                  </p>
                </div>

                <div className="print-box" style={{ background: theme.boxBg, padding: '14px', borderRadius: '12px', border: `1px solid ${theme.inputBorder}` }}>
                  <span style={{ fontSize: '12px', color: theme.textSecondary }}>Est. Total Valuation</span>
                  <p style={{ margin: '4px 0 0 0', fontSize: '18px', fontWeight: '700', color: '#16a34a' }}>
                    ₹{Number(result.estimatedValue).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* PDF Download Button */}
              <button
                className="no-print"
                onClick={handleDownloadPDF}
                style={{
                  width: '100%',
                  marginTop: '16px',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid #10b981',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                📄 Download PDF Valuation Report
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
