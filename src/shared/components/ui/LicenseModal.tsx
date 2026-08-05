import React, { useState } from 'react';
import { motion } from 'motion/react';

interface LicenseModalProps {
  onActivate: (key: string) => Promise<boolean>;
}

export const LicenseModal: React.FC<LicenseModalProps> = ({ onActivate }) => {
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const success = await onActivate(key.trim());
      if (!success) {
        setError('Invalid activation key or device limit reached.');
      }
    } catch (err) {
      setError('Connection error. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      background: '#020205', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      padding: '20px',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600&display=swap');
      `}</style>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          width: '100%', maxWidth: '420px',
          background: 'rgba(15, 17, 28, 0.45)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)',
          backdropFilter: 'blur(30px)',
          textAlign: 'center',
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        {/* Apple style minimalist key icon */}
        <div style={{
          width: '56px', height: '56px', margin: '0 auto 20px',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.01))',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '16px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a5b4fc" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
        </div>

        <h2 style={{ fontSize: '22px', fontWeight: 600, color: '#ffffff', marginBottom: '8px' }}>
          Activate FlowTrace
        </h2>
        <p style={{ fontSize: '13px', color: '#8e8e93', marginBottom: '24px', lineHeight: '1.5' }}>
          Please enter the software activation license key provided by your institution.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="text"
            placeholder="XXXX-XXXX-XXXX-XXXX"
            value={key}
            onChange={(e) => setKey(e.target.value.toUpperCase())}
            disabled={loading}
            style={{
              padding: '14px', borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(0,0,0,0.3)',
              color: '#ffffff', fontSize: '14px',
              fontFamily: 'monospace', textAlign: 'center',
              letterSpacing: '2px', outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => e.target.style.borderColor = 'rgba(165,180,252,0.5)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
          />

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ fontSize: '12px', color: '#ff453a', margin: 0 }}
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '14px', borderRadius: '12px',
              border: 'none',
              background: loading ? 'rgba(255,255,255,0.1)' : '#ffffff',
              color: '#000000', fontSize: '14px', fontWeight: 600,
              cursor: loading ? 'default' : 'pointer',
              transition: 'opacity 0.2s',
            }}
          >
            {loading ? 'Verifying Key...' : 'Activate Software'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
