import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { LOGO_LAYERS, LOGO_VIEWBOX } from '@/components/logo';

export const OG_SIZE = {
  width: 1200,
  height: 630,
} as const;

let fontsPromise: Promise<{
  openRundeRegular: Buffer;
  openRundeMedium: Buffer;
  ibmPlexMono: Buffer;
}> | null = null;

function loadOgFonts() {
  if (!fontsPromise) {
    const dir = join(process.cwd(), 'app/fonts/og');
    fontsPromise = Promise.all([
      readFile(join(dir, 'OpenRunde-Regular.ttf')),
      readFile(join(dir, 'OpenRunde-Medium.ttf')),
      readFile(join(dir, 'IBMPlexMono-Regular.ttf')),
    ]).then(([openRundeRegular, openRundeMedium, ibmPlexMono]) => ({
      openRundeRegular,
      openRundeMedium,
      ibmPlexMono,
    }));
  }
  return fontsPromise;
}

export type OgImageInput = {
  eyebrow: string;
  topRight: string;
  title: string;
  subtitle: string;
  bottomLeft: string;
  bottomRight: string;
  titleSize?: number;
};

export async function renderOgImage({
  eyebrow,
  topRight,
  title,
  subtitle,
  bottomLeft,
  bottomRight,
  titleSize,
}: OgImageInput) {
  const { openRundeRegular, openRundeMedium, ibmPlexMono } = await loadOgFonts();

  const computedTitleSize =
    titleSize ?? (title.length > 48 ? 48 : title.length > 28 ? 56 : 68);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#0a0a0a',
          color: '#e8e6e2',
          display: 'flex',
          position: 'relative',
          fontFamily: 'OpenRunde',
        }}
      >
        {/* Architectural hairline frame */}
        <div
          style={{
            position: 'absolute',
            top: 40,
            left: 40,
            right: 40,
            bottom: 40,
            border: '1px solid rgba(232, 230, 226, 0.09)',
            display: 'flex',
          }}
        />

        {/* Subtle vertical architectural rule */}
        <div
          style={{
            position: 'absolute',
            top: 40,
            bottom: 40,
            right: 310,
            width: 1,
            backgroundColor: 'rgba(232, 230, 226, 0.05)',
          }}
        />

        {/* Corner registration ticks */}
        <div style={{ position: 'absolute', top: 40, left: 40, width: 14, height: 1, backgroundColor: 'rgba(232, 230, 226, 0.36)' }} />
        <div style={{ position: 'absolute', top: 40, left: 40, width: 1, height: 14, backgroundColor: 'rgba(232, 230, 226, 0.36)' }} />
        <div style={{ position: 'absolute', top: 40, right: 40, width: 14, height: 1, backgroundColor: 'rgba(232, 230, 226, 0.36)' }} />
        <div style={{ position: 'absolute', top: 40, right: 40, width: 1, height: 14, backgroundColor: 'rgba(232, 230, 226, 0.36)' }} />
        <div style={{ position: 'absolute', bottom: 40, left: 40, width: 14, height: 1, backgroundColor: 'rgba(232, 230, 226, 0.36)' }} />
        <div style={{ position: 'absolute', bottom: 40, left: 40, width: 1, height: 14, backgroundColor: 'rgba(232, 230, 226, 0.36)' }} />
        <div style={{ position: 'absolute', bottom: 40, right: 40, width: 14, height: 1, backgroundColor: 'rgba(232, 230, 226, 0.36)' }} />
        <div style={{ position: 'absolute', bottom: 40, right: 40, width: 1, height: 14, backgroundColor: 'rgba(232, 230, 226, 0.36)' }} />

        {/* Subtle white 3D dithered W watermark in right bay */}
        <div
          style={{
            position: 'absolute',
            right: 60,
            top: 148,
            display: 'flex',
            opacity: 0.11,
          }}
        >
          <svg
            viewBox={LOGO_VIEWBOX}
            width="340"
            height="276"
          >
            {LOGO_LAYERS.map((layer) => (
              <path key={layer.fill} d={layer.d} fill={layer.fill} />
            ))}
          </svg>
        </div>

        {/* Content layout */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
            padding: '82px 92px',
          }}
        >
          {/* Top header row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 20,
              }}
            >
              <svg viewBox={LOGO_VIEWBOX} width="48" height="39">
                {LOGO_LAYERS.map((layer) => (
                  <path key={layer.fill} d={layer.d} fill={layer.fill} />
                ))}
              </svg>

              <div
                style={{
                  width: 1,
                  height: 22,
                  backgroundColor: 'rgba(232, 230, 226, 0.16)',
                }}
              />

              <span
                style={{
                  fontFamily: 'IBM Plex Mono',
                  fontSize: 13,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'rgba(232, 230, 226, 0.65)',
                }}
              >
                {eyebrow}
              </span>
            </div>

            <span
              style={{
                fontFamily: 'IBM Plex Mono',
                fontSize: 12,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'rgba(232, 230, 226, 0.4)',
              }}
            >
              {topRight}
            </span>
          </div>

          {/* Centerpiece typography */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              maxWidth: 780,
            }}
          >
            <div
              style={{
                fontSize: computedTitleSize,
                fontWeight: 500,
                letterSpacing: '-0.045em',
                lineHeight: 1.06,
                color: '#e8e6e2',
              }}
            >
              {title}
            </div>
            <div
              style={{
                marginTop: 22,
                fontSize: 23,
                fontWeight: 400,
                lineHeight: 1.48,
                color: 'rgba(232, 230, 226, 0.56)',
                maxWidth: 740,
              }}
            >
              {subtitle}
            </div>
          </div>

          {/* Bottom hairline metadata bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              borderTop: '1px solid rgba(232, 230, 226, 0.09)',
              paddingTop: 22,
            }}
          >
            <span
              style={{
                fontFamily: 'IBM Plex Mono',
                fontSize: 12.5,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(232, 230, 226, 0.48)',
              }}
            >
              {bottomLeft}
            </span>
            <span
              style={{
                fontFamily: 'IBM Plex Mono',
                fontSize: 12.5,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(232, 230, 226, 0.34)',
              }}
            >
              {bottomRight}
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        {
          name: 'OpenRunde',
          data: openRundeRegular,
          style: 'normal',
          weight: 400,
        },
        {
          name: 'OpenRunde',
          data: openRundeMedium,
          style: 'normal',
          weight: 500,
        },
        {
          name: 'IBM Plex Mono',
          data: ibmPlexMono,
          style: 'normal',
          weight: 400,
        },
      ],
    }
  );
}
