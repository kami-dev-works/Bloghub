import { useRef, useEffect } from 'react';
import { Box } from '@mui/material';

const extractHtmlParts = (html) => {
  const styleMatches = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)];
  const styles = styleMatches.map((m) => m[0]).join('\n');

  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const body = bodyMatch ? bodyMatch[0] : html;

  return { styles, body };
};

const HtmlContent = ({ html }) => {
  const hostRef = useRef(null);

  useEffect(() => {
    if (!hostRef.current || !html) return;

    hostRef.current.innerHTML = '';

    const shadowHost = document.createElement('div');
    shadowHost.style.width = '100%';

    hostRef.current.appendChild(shadowHost);

    const shadowRoot = shadowHost.attachShadow({ mode: 'open' });

    const { styles, body } = extractHtmlParts(html);

    const hasUserStyles = styles.trim().length > 0;

    const embeddedOverrides = `<style>
      :host{display:block}
      nav{position:relative !important; top:auto !important; z-index:auto !important;}
    </style>`;

    shadowRoot.innerHTML = hasUserStyles
      ? `${styles}${embeddedOverrides}${body}`
      : `<style>
          :host{display:block}
          body{margin:0;font-family:system-ui,-apple-system,sans-serif;line-height:1.8;padding:16px;color:#1a1a2e}
          img{max-width:100%;height:auto;border-radius:8px}
          pre{background:#1e293b;color:#e2e8f0;padding:16px;border-radius:8px;overflow:auto;font-size:0.9rem}
          code{background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:0.9em}
          blockquote{border-left:4px solid #6366f1;padding-left:16px;margin:16px 0;background:#f8fafc;border-radius:4px;font-style:italic}
          h1,h2,h3,h4,h5,h6{margin-top:24px;margin-bottom:12px;font-weight:700}
          h1{font-size:2rem}h2{font-size:1.75rem}h3{font-size:1.5rem}
          p{margin-bottom:12px}ul,ol{padding-left:24px;margin-bottom:12px}li{margin-bottom:4px}
          a{color:#6366f1}
        </style>
        ${body}
      `;
  }, [html]);

  return (
    <Box
      ref={hostRef}
      sx={{
        width: '100%',
      }}
    />
  );
};

const decodeHtmlEntities = (text) => {
  if (typeof document === 'undefined') return text;
  const el = document.createElement('div');
  el.innerHTML = text;
  return el.textContent || el.innerText || '';
};

export const processContent = (content) => {
  if (!content) return '';
  const preMatch = content.match(/<pre[^>]*class="ql-syntax"[^>]*>([\s\S]*?)<\/pre>/i);
  if (preMatch) {
    return decodeHtmlEntities(preMatch[1]);
  }
  return content;
};

export default HtmlContent;