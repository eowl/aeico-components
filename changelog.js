import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuration
// Optionally set any of the properties below. Unset properties fall back to defaults
// (default logic is at each `config.xxx || ...` line below):
//   baseUrl:       Repository homepage URL. Default: derived from the git remote URL (SSH/HTTPS)
//   tagFormat:     Glob pattern for tags. Default: "<pkgName>@*" in package mode, "v*" in single-package mode
//   changelogPath: Path to CHANGELOG.md. Default: "packages/<pkgName>/CHANGELOG.md" in package mode,
//                  "CHANGELOG.md" in the repo root in single-package mode
//   version:       Changelog section name. Default: 'Unreleased' (overridden by -v / -b / -bn)
const config = {
  // baseUrl: 'https://github.com/owner/repo',
  // tagFormat: 'v*',
  // changelogPath: './CHANGELOG.md',
  // version: 'Unreleased',
};
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
let pkgName = null;
let bumpType = null;
let npmBumpType = null; // -bn / -nb: run npm version command
let explicitVersion = null;

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '-p') {
    pkgName = args[++i];
    if (!pkgName) {
      console.error('Error: -p requires a package name. Example: node changlog.js -p aeico-ssr');
      process.exit(1);
    }
  } else if (arg === '-v') {
    explicitVersion = args[++i];
    if (!explicitVersion) {
      console.error('Error: -v requires a version number. Example: node changlog.js -v 1.2.3');
      process.exit(1);
    }
  } else if (arg === '-b') {
    bumpType = args[++i];
    if (!['major', 'minor', 'patch'].includes(bumpType)) {
      console.error(`Error: -b requires major, minor or patch. Got: "${bumpType}"`);
      process.exit(1);
    }
  } else if (arg === '-bn' || arg === '-nb') {
    npmBumpType = args[++i];
    if (!['major', 'minor', 'patch'].includes(npmBumpType)) {
      console.error(`Error: ${arg} requires major, minor or patch. Got: "${npmBumpType}"`);
      process.exit(1);
    }
  } else {
    console.error(`Error: Unknown argument "${arg}". Usage: node changlog.js [-p <pkg>] [-v <version> | -b <major|minor|patch> | -bn/-nb <major|minor|patch>]`);
    process.exit(1);
  }
}

if ((explicitVersion && (bumpType || npmBumpType)) || (bumpType && npmBumpType)) {
  console.error('Error: -v, -b and -bn/-nb are mutually exclusive. Please use only one.');
  process.exit(1);
}

function deriveBaseUrl() {
  try {
    const remoteUrl = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
    let url = remoteUrl;
    const sshMatch = url.match(/^git@([^:]+):(.+?)(?:\.git)?$/);
    if (sshMatch) {
      return `https://${sshMatch[1]}/${sshMatch[2]}`;
    }
    url = url.replace(/\.git$/, '');
    return url;
  } catch {
    console.error('Warning: Cannot derive baseUrl from git remote. PR links may be incorrect.');
    return '';
  }
}

function bumpVersion(version, type) {
  const parts = version.replace(/^v/, '').split('.').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) {
    console.error(`Error: Cannot parse version "${version}" for bumping.`);
    process.exit(1);
  }
  let [major, minor, patch] = parts;
  if (type === 'major') { major += 1; minor = 0; patch = 0; }
  else if (type === 'minor') { minor += 1; patch = 0; }
  else { patch += 1; }

  return `${major}.${minor}.${patch}`;
}

function extractVersionFromTag(tag) {
  if (pkgName && tag.startsWith(`${pkgName}@`)) {
    return tag.slice(pkgName.length + 1);
  }

  return tag;
}

function npmBumpVersion(type) {
  try {
    const workspaceFlag = pkgName ? ` -w "packages/${pkgName}"` : '';
    const cmd = `npm version ${type} --no-git-tag-version${workspaceFlag}`;
    console.log(`Running: ${cmd}`);
    const output = execSync(cmd, { encoding: 'utf8', cwd: __dirname }).trim();
    const versionMatch = output.match(/v?(\d+\.\d+\.\d+(?:[-+][\w.]+)?)/);
    if (!versionMatch) {
      console.error(`Error: Cannot parse version from npm output:\n${output}`);
      process.exit(1);
    }
    return versionMatch[1];

  } catch (error) {
    console.error('Error: npm version failed. Error message:', error.message);
    process.exit(1);
  }
}

const baseUrl = config.baseUrl || deriveBaseUrl();
const tagFormat = config.tagFormat || (pkgName ? `${pkgName}@*` : 'v*');
const changelogPath = config.changelogPath || (pkgName
  ? path.join(__dirname, 'packages', pkgName, 'CHANGELOG.md')
  : path.join(__dirname, 'CHANGELOG.md'));

if (pkgName) {
  const pkgDir = path.join(__dirname, 'packages', pkgName);
  if (!fs.existsSync(pkgDir)) {
    console.error(`Error: Directory not found: ${pkgDir}. Please check the package name.`);
    process.exit(1);
  }
  console.log(`Analyzing package: ${pkgName}...`);
} else {
  console.log('Running in single-package mode (no package argument provided).');
}

try {
  console.log(`Fetching latest tags from remote...`);
  execSync('git fetch origin --tags', { stdio: 'ignore' });

  const tagCmd = `git tag --list "${tagFormat}" --sort=-v:refname`;
  const tags = execSync(tagCmd, { encoding: 'utf8' }).trim().split('\n').filter(Boolean);

  if (tags.length === 0) {
    console.error(`Warning: No tags matching "${tagFormat}" found. Cannot compare against a baseline version.`);
    process.exit(1);
  }

  const PREV_TAG = tags[0];
  console.log(`Found previous release tag: ${PREV_TAG}`);

  let sectionVersion = config.version || 'Unreleased';
  if (explicitVersion) {
    sectionVersion = explicitVersion.replace(/^v/, '');
  } else if (npmBumpType) {
    sectionVersion = npmBumpVersion(npmBumpType);
  } else if (bumpType) {
    sectionVersion = bumpVersion(extractVersionFromTag(PREV_TAG), bumpType);
  }
  console.log(`Changelog section version: ${sectionVersion}`);

  const pathFilter = pkgName ? ` -- "packages/${pkgName}"` : '';
  const logCmd = `git log ${PREV_TAG}..HEAD --merges --first-parent --format="---COMMIT---%n%s%n%b%n%an"${pathFilter}`;
  const logOutput = execSync(logCmd, { encoding: 'utf8' }).trim();

  let markdownLines = [];

  if (logOutput) {
    const commits = logOutput.split('---COMMIT---\n').filter(Boolean);

    commits.forEach(rawCommit => {
        const lines = rawCommit.split('\n').map(l => l.trim()).filter(Boolean);
        if (lines.length < 2) return;

        const subject = lines[0];
        const authorMatch = subject.match(/from ([\w.-]+)\//i);
        const author = authorMatch ? authorMatch[1] : lines[lines.length - 1].trim().toLowerCase();

        let prTitle = lines.length > 2 && !lines[1].startsWith('Merge pull request') ? lines[1] : subject;
        const prMatch = subject.match(/Merge pull request #(\d+)/i);

        if (prMatch) {
            const prNumber = prMatch[1];
            const prLink = `[#${prNumber}](${baseUrl}/pull/${prNumber})`;
            markdownLines.push(`* ${prTitle} by @${author} in ${prLink}`);
        } else {
            markdownLines.push(`* ${subject} by @${author}`);
        }
    });
  }

  const currentDate = new Date().toISOString().split('T')[0];
  let markdownText = `\n## [${sectionVersion}] ${currentDate}\n\n`;

  if (markdownLines.length > 0) {
    markdownText += markdownLines.join('\n') + '\n';
  } else {
    markdownText += `* No new pull requests merged in this package.\n`;
  }
  // Package mode tags look like "<pkgName>@<version>", single-package mode like "v<version>"
  const compareRef = sectionVersion === 'Unreleased'
    ? 'Unreleased'
    : (pkgName ? `${pkgName}@${sectionVersion}` : `v${sectionVersion}`);
  markdownText += `\n**Full Changelog**: ${baseUrl}/compare/${PREV_TAG}...${compareRef}\n`;

  const title = pkgName ? `# ${pkgName} Changelog\n` : `# Changelog\n`;

  if (fs.existsSync(changelogPath)) {
    let existingContent = fs.readFileSync(changelogPath, 'utf8');
    const sectionRegex = new RegExp(`##\\s*\\[${sectionVersion}\\][\\s\\S]*?(?=\\n##\\s*\\[|$)`, 'i');

    if (sectionRegex.test(existingContent)) {
      existingContent = existingContent.replace(sectionRegex, markdownText.trim());
      fs.writeFileSync(changelogPath, existingContent, 'utf8');

      console.log(`Found an existing [${sectionVersion}] section. Successfully updated: ${changelogPath}`);
    } else {
      const lines = existingContent.split('\n');
      let insertAt = 0;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim().startsWith('# ')) { insertAt = i + 1; break; }
        if (lines[i].trim().startsWith('## [')) { insertAt = i; break; }
      }
      lines.splice(insertAt, 0, markdownText + '\n');
      fs.writeFileSync(changelogPath, lines.join('\n'), 'utf8');

      console.log(`No [${sectionVersion}] section found. Successfully inserted a new section: ${changelogPath}`);
    }
  } else {
    fs.writeFileSync(changelogPath, title + markdownText, 'utf8');
    console.log(`Created and wrote changelog file: ${changelogPath}`);
  }

} catch (error) {
  console.error("Execution failed. Error message:", error.message);
  process.exit(1);
}
