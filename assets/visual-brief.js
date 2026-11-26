const visualBriefForm = document.getElementById('visual-brief-form');
const visualBriefResult = document.getElementById('visual-brief-result');
const visualBriefDownload = document.getElementById('visual-brief-download');
const visualBriefStatus = document.getElementById('visual-brief-status');
const visualBriefSubmit = visualBriefForm.querySelector('[type="submit"]');

visualBriefForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const answers = new FormData(visualBriefForm);
  const audience = answers.get('audience').trim();
  const decision = answers.get('decision').trim();
  const gap = answers.get('gap').trim();
  if (!audience || !decision || !gap) {
    visualBriefStatus.textContent = 'Please add an audience, a decision and a gap before generating your brief.';
    return;
  }
  visualBriefResult.value = [
    'Power BI custom visual — project brief',
    `Audience: ${audience}`,
    `Decision to support: ${decision}`,
    `Gap in standard visuals: ${gap}`,
    `Intended distribution: ${answers.get('distribution')}`,
    '',
    'To confirm before implementation:',
    '- Required measures, categories, labels and formatting.',
    '- How filtering, selection and empty states should behave.',
    '- Example data, expected report sizes and accessibility requirements.',
    '- Acceptance tests, distribution requirements and maintenance owner.'
  ].join('\n');
  visualBriefDownload.disabled = false;
  visualBriefStatus.textContent = 'Brief ready to review or download. Nothing has been sent.';
});

visualBriefForm.addEventListener('input', () => {
  if (!visualBriefResult.value) return;
  visualBriefDownload.disabled = true;
  visualBriefStatus.textContent = 'Your answers changed. Generate a new brief before downloading.';
});

visualBriefDownload.addEventListener('click', () => {
  const briefUrl = URL.createObjectURL(new Blob([visualBriefResult.value], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = briefUrl;
  link.download = 'power-bi-visual-brief.txt';
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(briefUrl), 1000);
});

visualBriefSubmit.disabled = false;
