/** Builds a minimal single-page text PDF (Helvetica) for the demo — no external library. */
const esc = (s: string) => s.replace(/[\\()]/g, '\\$&').replace(/[^\x20-\x7E]/g, '?')

export const makePdfBlob = (title: string, lines: string[]): Blob => {
  const content = ['BT', '/F1 18 Tf', '50 780 Td', `(${esc(title)}) Tj`, '/F1 11 Tf', '0 -28 Td', '16 TL', ...lines.map((l) => `(${esc(l)}) '`), 'ET'].join('\n')
  const objs = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ]
  let pdf = '%PDF-1.4\n'
  const offsets: number[] = []
  objs.forEach((o, i) => { offsets.push(pdf.length); pdf += `${i + 1} 0 obj\n${o}\nendobj\n` })
  const xref = pdf.length
  pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n` + offsets.map((o) => String(o).padStart(10, '0') + ' 00000 n \n').join('')
  pdf += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`
  return new Blob([pdf], { type: 'application/pdf' })
}

export const mockImageReport = (title: string, subtitle: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" fill="#0b1220"/><ellipse cx="200" cy="210" rx="120" ry="150" fill="#1e293b"/><path d="M200 70v280M110 150q90 40 180 0M105 200q95 40 190 0M110 250q90 40 180 0" stroke="#94a3b8" stroke-width="6" fill="none" opacity=".6"/><text x="200" y="40" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#e2e8f0">${title}</text><text x="200" y="385" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#64748b">${subtitle} — illustrative mock image</text></svg>`
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg)
}
