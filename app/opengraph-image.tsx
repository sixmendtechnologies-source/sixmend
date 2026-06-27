import { ImageResponse } from 'next/og';

export const dynamic = "force-static";
export const alt = 'Sixmend Technology — Software Development, QA, DevOps & IT Support';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000000',
          fontFamily: 'sans-serif',
          padding: '60px',
          position: 'relative',
        }}
      >
        {/* Radial glow */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle at 50% 40%, rgba(255,255,255,0.055) 0%, transparent 65%)',
          }}
        />

        {/* Grid lines */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '100px',
            padding: '6px 18px',
            marginBottom: '36px',
          }}
        >
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80' }} />
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', fontWeight: 600, letterSpacing: '0.08em' }}>
            AVAILABLE FOR NEW PROJECTS
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontSize: '72px',
            fontWeight: 700,
            color: '#ffffff',
            textAlign: 'center',
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            marginBottom: '24px',
          }}
        >
          <span>We build software</span>
          <span style={{ color: 'rgba(255,255,255,0.35)' }}>that ships.</span>
        </div>

        {/* Sub */}
        <div
          style={{
            fontSize: '22px',
            color: 'rgba(255,255,255,0.35)',
            textAlign: 'center',
            marginBottom: '48px',
          }}
        >
          Software Development · QA · DevOps · IT Support
        </div>

        {/* Pills */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {['TypeScript', 'React', 'Node.js', 'AWS', 'Docker'].map((t) => (
            <div
              key={t}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '8px 18px',
                color: 'rgba(255,255,255,0.4)',
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              {t}
            </div>
          ))}
        </div>

        {/* Bottom brand */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            color: 'rgba(255,255,255,0.15)',
            fontSize: '14px',
            fontWeight: 600,
            letterSpacing: '0.12em',
          }}
        >
          WWW.SIXMEND.COM
        </div>
      </div>
    ),
    { ...size },
  );
}
