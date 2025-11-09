import { ThemeSettings } from '@/types';

export function globalStyles(theme: ThemeSettings) {
  return `
    :root {
      --primary: ${theme.primary};
      --text: ${theme.text};
      --bg: ${theme.bg};
      --card: ${theme.card};
      --input: ${theme.input};
      --border: ${theme.border};
      --title-font: '${theme.titleFont}';
      --subtitle-font: '${theme.subtitleFont}';
      --body-font: '${theme.bodyFont}';
      --meal-title-font: '${theme.mealTitleFont}';
      --meal-body-font: '${theme.mealBodyFont}';
      --notes-title-font: '${theme.notesTitleFont}';
      --notes-body-font: '${theme.notesBodyFont}';
    }

    body {
      font-family: var(--body-font);
      background: var(--bg);
      color: var(--text);
    }

    .paper {
      background: ${theme.paperBg};
      color: ${theme.paperText};
    }
  `;
}
