/**
 * Generate SVG placeholder images that work reliably
 * Each placeholder has a unique gradient based on the title hash
 */

const colors = [
  { from: '#b7ff3c', to: '#77ff00' },    // Lime gradient
  { from: '#00d4ff', to: '#0099ff' },    // Blue gradient
  { from: '#ff006e', to: '#ff0055' },    // Pink gradient
  { from: '#ffbe0b', to: '#ffa500' },    // Orange gradient
  { from: '#8338ec', to: '#6a4c93' },    // Purple gradient
  { from: '#26de81', to: '#20c997' },    // Green gradient
  { from: '#ff006e', to: '#fb5607' },    // Red-orange gradient
  { from: '#00bbf9', to: '#00d4ff' },    // Cyan gradient
];

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

export function getPlaceholderImage(title: string, width = 800, height = 600): string {
  const colorIndex = hashCode(title) % colors.length;
  const { from, to } = colors[colorIndex];
  const gradientId = `gradient-${colorIndex}`;
  
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${from};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${to};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#${gradientId})" />
      <text 
        x="50%" 
        y="50%" 
        font-size="48" 
        font-weight="bold" 
        text-anchor="middle" 
        dy=".3em" 
        fill="rgba(255,255,255,0.3)"
        font-family="system-ui, -apple-system, sans-serif"
      >
        ${title.substring(0, 1).toUpperCase()}
      </text>
    </svg>
  `;
  
  const encoded = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${encoded}`;
}

export function getBannerPlaceholder(title: string): string {
  return getPlaceholderImage(title, 1200, 300);
}

export function getProjectPlaceholder(title: string): string {
  return getPlaceholderImage(title, 800, 600);
}

export function getAvatarPlaceholder(initials: string): string {
  return getPlaceholderImage(initials, 200, 200);
}
