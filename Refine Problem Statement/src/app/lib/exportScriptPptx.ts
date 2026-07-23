import pptxgen from 'pptxgenjs';
import type { ScriptBlock } from '../data/seedData';

const ACCENT_HEX: Record<string, string> = {
  indigo:  '6366f1',
  sky:     '0ea5e9',
  emerald: '10b981',
  amber:   'f59e0b',
  rose:    'f43f5e',
  purple:  'a855f7',
  slate:   '64748b',
};

function htmlToLines(html: string): { text: string; bold?: boolean; heading?: boolean }[] {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  const lines: { text: string; bold?: boolean; heading?: boolean }[] = [];

  function walk(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const t = node.textContent?.trim();
      if (t) lines.push({ text: t });
      return;
    }
    const el = node as Element;
    const tag = el.tagName?.toLowerCase();

    if (tag === 'h2' || tag === 'h3') {
      lines.push({ text: el.textContent?.trim() ?? '', heading: true });
    } else if (tag === 'li') {
      lines.push({ text: '• ' + (el.textContent?.trim() ?? '') });
    } else if (tag === 'strong' || tag === 'b') {
      // handled by parent context — just recurse
      el.childNodes.forEach(walk);
    } else if (tag === 'p' || tag === 'ol' || tag === 'ul') {
      el.childNodes.forEach(walk);
    } else {
      el.childNodes.forEach(walk);
    }
  }

  tmp.childNodes.forEach(walk);
  return lines.filter(l => l.text.length > 0);
}

export async function exportScriptPptx(blocks: ScriptBlock[]): Promise<void> {
  const prs = new pptxgen();

  prs.layout = 'LAYOUT_WIDE'; // 13.33" x 7.5"
  prs.title = 'AI in the PDLC — Presentation Script';
  prs.author = 'S&PE Product AI Pillar';

  // ── Title slide ──────────────────────────────────────────────────────────
  const titleSlide = prs.addSlide();
  titleSlide.background = { color: '0f172a' };
  titleSlide.addText('S&PE PRODUCT DEMO', {
    x: 0.6, y: 1.8, w: 12, h: 0.4,
    fontSize: 10, bold: true, color: '60a5fa',
    charSpacing: 4, fontFace: 'Arial',
  });
  titleSlide.addText('AI in the PDLC\nPresentation Script', {
    x: 0.6, y: 2.3, w: 12, h: 2.2,
    fontSize: 40, bold: true, color: 'FFFFFF',
    fontFace: 'Arial', lineSpacingMultiple: 1.1,
  });
  titleSlide.addText('Accenture S&PE · AI in Product Management', {
    x: 0.6, y: 4.7, w: 12, h: 0.5,
    fontSize: 14, color: '94a3b8', fontFace: 'Arial',
  });

  // ── One slide per script block ────────────────────────────────────────────
  for (const block of blocks) {
    const slide = prs.addSlide();
    const accent = ACCENT_HEX[block.accent] ?? '6366f1';

    // Left colour bar
    slide.addShape(prs.ShapeType.rect, {
      x: 0, y: 0, w: 0.12, h: 7.5,
      fill: { color: accent },
      line: { type: 'none' },
    });

    // Label badge
    slide.addShape(prs.ShapeType.roundRect, {
      x: 0.3, y: 0.3, w: 0.55, h: 0.42,
      fill: { color: accent + '33' },
      line: { color: accent, pt: 1 },
      rectRadius: 0.08,
    });
    slide.addText(block.label, {
      x: 0.3, y: 0.3, w: 0.55, h: 0.42,
      fontSize: 11, bold: true, color: accent,
      align: 'center', valign: 'middle', fontFace: 'Arial',
    });

    // Title
    slide.addText(block.title, {
      x: 1.0, y: 0.28, w: 11.8, h: 0.6,
      fontSize: 22, bold: true, color: '0f172a',
      fontFace: 'Arial', valign: 'middle',
    });

    // Divider line under title
    slide.addShape(prs.ShapeType.line, {
      x: 1.0, y: 0.95, w: 11.7, h: 0,
      line: { color: 'e2e8f0', pt: 1 },
    });

    // Body content
    const lines = htmlToLines(block.body);
    let yPos = 1.15;
    const lineH = 0.32;
    const headingH = 0.38;

    for (const line of lines) {
      if (yPos > 6.9) break; // guard against overflow

      if (line.heading) {
        slide.addText(line.text, {
          x: 1.0, y: yPos, w: 11.7, h: headingH,
          fontSize: 13, bold: true, color: accent,
          fontFace: 'Arial',
        });
        yPos += headingH + 0.05;
      } else {
        slide.addText(line.text, {
          x: 1.0, y: yPos, w: 11.7, h: lineH,
          fontSize: 11, color: '334155',
          fontFace: 'Arial', wrap: true,
        });
        yPos += lineH;
      }
    }

    // Slide number (bottom right)
    slide.addText(`${block.label}`, {
      x: 12.5, y: 7.1, w: 0.6, h: 0.3,
      fontSize: 9, color: '94a3b8', align: 'right', fontFace: 'Arial',
    });
  }

  // ── End slide ─────────────────────────────────────────────────────────────
  const endSlide = prs.addSlide();
  endSlide.background = { color: '0f172a' };
  endSlide.addText('Thank you', {
    x: 0.6, y: 2.8, w: 12, h: 1.0,
    fontSize: 36, bold: true, color: 'FFFFFF', fontFace: 'Arial',
  });
  endSlide.addText('S&PE Product AI Pillar · Accenture', {
    x: 0.6, y: 4.0, w: 12, h: 0.5,
    fontSize: 14, color: '94a3b8', fontFace: 'Arial',
  });

  await prs.writeFile({ fileName: 'AI-in-PDLC-Presentation-Script.pptx' });
}
