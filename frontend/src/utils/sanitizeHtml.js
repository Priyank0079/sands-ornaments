import DOMPurify from 'dompurify';

export const sanitizeHtml = (html = '') => DOMPurify.sanitize(String(html || ''), {
  USE_PROFILES: { html: true },
});
