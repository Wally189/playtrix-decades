'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const key = 'playtrix.p12.capture.pilot.v1';
  const text = document.querySelector('#captureText');
  const kind = document.querySelector('#captureKind');
  const area = document.querySelector('#captureArea');
  const list = document.querySelector('#captureList');
  const count = document.querySelector('#captureCount');
  const status = document.querySelector('#saveStatus');

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));

  const load = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(key) || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  let captures = load();
  const save = () => localStorage.setItem(key, JSON.stringify(captures));

  const render = () => {
    list.innerHTML = '';
    captures.forEach((item) => {
      const row = document.createElement('div');
      row.className = 'simple-row';
      row.innerHTML = `<div><strong>${escapeHtml(item.text)}</strong><br><small>${escapeHtml(item.kind)} · ${escapeHtml(item.area)}</small></div><button type="button" class="icon-button" aria-label="Delete capture">×</button>`;
      row.querySelector('button').addEventListener('click', () => {
        captures = captures.filter((candidate) => candidate.id !== item.id);
        save();
        render();
      });
      list.append(row);
    });
    count.textContent = String(captures.length);
  };

  document.querySelector('#saveCapture').addEventListener('click', () => {
    const value = text.value.trim();
    if (!value) {
      status.textContent = 'Enter an item before saving.';
      text.focus();
      return;
    }
    captures.unshift({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      text: value,
      kind: kind.value,
      area: area.value,
      createdAt: new Date().toISOString()
    });
    save();
    text.value = '';
    status.textContent = 'Saved locally in this browser.';
    render();
  });

  document.querySelector('#clearCaptures').addEventListener('click', () => {
    captures = [];
    save();
    status.textContent = 'Pilot test data cleared.';
    render();
  });

  render();
});
