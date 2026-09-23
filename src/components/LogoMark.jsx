/**
 * LogoMark — shows only the UMC icon portion of the logo (no text below).
 * The source image is 1254×1254px; the icon fills roughly the top 730px.
 * We render the image at a scaled width so the icon fills the desired height,
 * then clip with overflow-hidden.
 *
 * Props:
 *   height  — displayed height in px (default 40)
 *   className — extra classes on the wrapper
 */
export default function LogoMark({ height = 40, className = '' }) {
  // Original image: 1254 × 1254px
  // Icon-only region: top ~730px of the image (x:100, y:50, w:1054, h:730)
  // We want to show a square-ish crop of the mark, centred horizontally.
  // Approach: scale the full image so the icon region fills `height` px tall,
  // then shift it up/left so only the mark is visible.

  const srcH = 1254;
  const cropY = 50;   // top of icon in source
  const cropH = 730;  // height of icon region in source
  const cropX = 100;  // left of icon in source
  const cropW = 1054; // width of icon region in source

  // Scale factor: we want cropH → height px
  const scale = height / cropH;

  const imgW = srcH * scale;   // rendered image width
  const imgH = srcH * scale;   // rendered image height

  const wrapW = cropW * scale; // visible wrapper width
  const offsetX = cropX * scale;
  const offsetY = cropY * scale;

  return (
    <div
      className={`overflow-hidden shrink-0 ${className}`}
      style={{ width: wrapW, height: height }}
      aria-hidden="true"
    >
      <img
        src="/static/logo.png"
        alt=""
        style={{
          width: imgW,
          height: imgH,
          marginLeft: -offsetX,
          marginTop: -offsetY,
          maxWidth: 'none',
        }}
      />
    </div>
  );
}
