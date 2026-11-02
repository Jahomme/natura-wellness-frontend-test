const fs = require('fs');
const path = require('path');
const readline = require('readline');

const conversationId = "f0657622-3ca9-444b-93f0-7e1dd17d40fe";
const homeDir = process.env.USERPROFILE || process.env.HOME || '';
const transcriptPath = path.join(
  homeDir,
  '.gemini',
  'antigravity',
  'brain',
  conversationId,
  '.system_generated',
  'logs',
  'transcript_full.jsonl'
);

if (!fs.existsSync(transcriptPath)) {
  console.error('Log file not found in:', transcriptPath);
  process.exit(1);
}

const rl = readline.createInterface({ input: fs.createReadStream(transcriptPath) });

let output = '# AI Conversation Log — Natura Wellness Frontend Test\n\n';
output += '> Complete session of pair programming with AI assistant (Antigravity), according to requirements on **To submit** of `INSTRUCTIONS.md`.\n\n---\n\n';

let currentTurn = 0;

function sanitizePaths(text) {
  if (!text) return '';
  // Replace brain artifact paths with ./docs/
  let sanitized = text.replace(
    /file:\/\/\/[a-zA-Z]:[/\\][^)"'\s>]+[/\\]\.gemini[/\\]antigravity[/\\]brain[/\\][^)"'\s>]+[/\\]/gi,
    './docs/'
  );
  // Replace workspace file:/// paths with ./
  sanitized = sanitized.replace(
    /file:\/\/\/[a-zA-Z]:[/\\][^)"'\s>]+[/\\]natura-wellness-frontend-test[/\\]/gi,
    './'
  );
  // Replace plain absolute workspace paths with ./
  sanitized = sanitized.replace(
    /[a-zA-Z]:[/\\][^)"'\s>]+[/\\]natura-wellness-frontend-test[/\\]/gi,
    './'
  );
  return sanitized;
}

rl.on('line', (line) => {
  try {
    const item = JSON.parse(line);
    if (item.type === 'USER_INPUT' && item.source === 'USER_EXPLICIT') {
      currentTurn++;
      let text = item.content || '';
      text = text
        .replace(/<USER_REQUEST>([\s\S]*?)<\/USER_REQUEST>/g, '$1')
        .replace(/<ADDITIONAL_METADATA>[\s\S]*?<\/ADDITIONAL_METADATA>/g, '')
        .replace(/<USER_SETTINGS_CHANGE>[\s\S]*?<\/USER_SETTINGS_CHANGE>/g, '')
        .replace(/<SYSTEM_MESSAGE>[\s\S]*?<\/SYSTEM_MESSAGE>/g, '')
        .trim();
      output += `## 👤 Turn ${currentTurn} — User\n\n${sanitizePaths(text)}\n\n`;
    } else if (item.type === 'PLANNER_RESPONSE' && item.source === 'MODEL' && item.content) {
      output += `### 🤖 Assistant (Antigravity)\n\n${sanitizePaths(item.content.trim())}\n\n---\n\n`;
    }
  } catch (e) {
    // ignore malformed lines
  }
});

rl.on('close', () => {
  const destPath = path.resolve(process.cwd(), 'AI_CONVERSATION.md');
  fs.writeFileSync(destPath, output, 'utf8');
  console.log(`✅ AI_CONVERSATION.md generated: ${destPath}`);
});
