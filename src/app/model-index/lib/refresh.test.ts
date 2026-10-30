import { execFileSync, spawnSync } from 'node:child_process';
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

/**
 * scripts/refresh/daily.sh, run for real against a throwaway pair of
 * repositories. The script's order is the thing under test: its test step
 * ran before the new snapshot was copied in, so it passed or failed on
 * yesterday's file and waved through whatever tonight's would break
 * (2026-10-01). `git` is the real one; `pnpm` and `node` are stand-ins,
 * and the stand-in for the site's tests does what the real ones do — it
 * reads the snapshot that is in the tree.
 */
const SCRIPT = join(process.cwd(), 'scripts', 'refresh', 'daily.sh');
const DATA = join('src', 'app', 'model-index', 'data');
const LOGOS = join('public', 'model-index', 'logos');

const snapshot = (label: string) => `${JSON.stringify({ label })}\n`;

let root = '';
afterEach(() => {
  if (root) rmSync(root, { recursive: true, force: true });
  root = '';
});

function sandbox(incoming: string) {
  root = mkdtempSync(join(tmpdir(), 'refresh-'));
  // Nothing of this machine's: no git config, no bugscan lock under the
  // real home (the noon scan holds one while these tests run), and no mail
  // — the throwaway site carries no notify.sh to send one with.
  const env: NodeJS.ProcessEnv = { ...process.env };
  for (const k of Object.keys(env)) if (k.startsWith('GIT_')) delete env[k];
  Object.assign(env, {
    HOME: root,
    SANDBOX: root,
    GIT_AUTHOR_NAME: 'refresh-test',
    GIT_AUTHOR_EMAIL: 'refresh-test@example.invalid',
    GIT_COMMITTER_NAME: 'refresh-test',
    GIT_COMMITTER_EMAIL: 'refresh-test@example.invalid',
    BUGSCAN_ENV: join(root, 'no-such.env'),
    BUGSCAN_PATH: `${join(root, 'bin')}:${process.env.PATH}`,
    REFRESH_PIPELINE: join(root, 'pipeline'),
    REFRESH_SITE: join(root, 'site'),
    REFRESH_STATE: join(root, 'state'),
  });
  const git = (cwd: string, ...args: string[]) =>
    execFileSync('git', args, { cwd, env, encoding: 'utf8' }).trim();
  const repo = (name: string, files: Record<string, string>) => {
    const dir = join(root, name);
    mkdirSync(dir);
    git(root, 'init', '-q', '--bare', '-b', 'main', `${name}.git`);
    git(dir, 'init', '-q', '-b', 'main');
    for (const [path, text] of Object.entries(files)) {
      mkdirSync(join(dir, path, '..'), { recursive: true });
      writeFileSync(join(dir, path), text);
    }
    git(dir, 'add', '-A');
    git(dir, 'commit', '-q', '-m', 'start');
    git(dir, 'remote', 'add', 'origin', join(root, `${name}.git`));
    git(dir, 'push', '-q', 'origin', 'main');
    return dir;
  };

  const site = repo('site', {
    [join(DATA, 'index.json')]: snapshot('yesterday'),
    [join(DATA, 'image.json')]: snapshot('yesterday'),
    [join(DATA, 'video.json')]: snapshot('yesterday'),
    [join(LOGOS, 'kept.png')]: 'kept',
  });
  const pipeline = repo('pipeline', { 'README.md': 'pipeline\n' });
  // What the fetch and build leave behind; untracked there, as in life.
  mkdirSync(join(pipeline, 'out'));
  for (const f of ['index', 'image', 'video'])
    writeFileSync(join(pipeline, 'out', `${f}.json`), incoming);
  mkdirSync(join(pipeline, 'raw', 'marks'), { recursive: true });
  writeFileSync(join(pipeline, 'raw', 'marks', 'new-board.png'), 'mark');

  const stub = (name: string, body: string) => {
    mkdirSync(join(root, 'bin'), { recursive: true });
    writeFileSync(join(root, 'bin', name), `#!/bin/sh\n${body}\n`);
    chmodSync(join(root, 'bin', name), 0o755);
  };
  // The site's tests: red on a snapshot they cannot stand, and on record
  // about which snapshot they were shown.
  stub(
    'pnpm',
    `case "$*" in
  'exec vitest run')
    cat ${DATA}/index.json >>"$SANDBOX/tested"
    ! grep -q broken ${DATA}/index.json ;;
esac`,
  );
  stub(
    'node',
    `case "$1" in
  scripts/index-history.ts) [ -z "\${HISTORY_FAILS:-}" ] ;;
esac`,
  );

  return {
    site,
    run: (extra: Record<string, string> = {}) =>
      spawnSync('bash', [SCRIPT, '--force'], {
        env: { ...env, ...extra },
        encoding: 'utf8',
      }),
    /** What is on origin/main: what a deploy would build. */
    shipped: (path: string) => {
      try {
        return git(join(root, 'site.git'), 'show', `main:${path}`);
      } catch {
        return null;
      }
    },
    tested: () =>
      existsSync(join(root, 'tested'))
        ? readFileSync(join(root, 'tested'), 'utf8')
        : '',
    dirty: () => git(site, 'status', '--porcelain'),
    /** git, in the site checkout. */
    git: (...args: string[]) => git(site, ...args),
  };
}

describe('scripts/refresh/daily.sh', { timeout: 60_000 }, () => {
  it('runs the site tests on the snapshot it is about to ship, and ships nothing they reject', () => {
    const s = sandbox(snapshot('tonight, broken'));
    const result = s.run();

    expect(s.tested()).toContain('tonight, broken');
    expect(result.status).not.toBe(0);
    expect(s.shipped(join(DATA, 'index.json'))).toBe(
      snapshot('yesterday').trim(),
    );
    // And the tree is put back, so tomorrow's run is not refused over
    // tonight's leftovers.
    expect(readFileSync(join(s.site, DATA, 'index.json'), 'utf8')).toBe(
      snapshot('yesterday'),
    );
    expect(s.dirty()).toBe('');
  });

  it('ships a snapshot the tests accept, with the marks the fetch captured', () => {
    const s = sandbox(snapshot('tonight'));
    const result = s.run();

    expect(result.status).toBe(0);
    expect(s.tested()).toContain('tonight');
    expect(s.shipped(join(DATA, 'index.json'))).toBe(
      snapshot('tonight').trim(),
    );
    expect(s.shipped(join(LOGOS, 'new-board.png'))).toBe('mark');
    expect(s.dirty()).toBe('');
  });

  // On a branch that fast-forwards, the snapshot was committed to the
  // branch, `git push origin main` pushed an unchanged main, and the run
  // exited 0 saying it had shipped (2026-10-03).
  it('refuses to run when the site checkout is not on main', () => {
    const s = sandbox(snapshot('tonight'));
    s.git('switch', '-q', '-c', 'draft');
    const before = s.git('rev-parse', 'HEAD');
    const result = s.run();

    expect(result.status).not.toBe(0);
    expect(s.shipped(join(DATA, 'index.json'))).toBe(
      snapshot('yesterday').trim(),
    );
    // Nothing committed to the branch someone is working on.
    expect(s.git('rev-parse', 'HEAD')).toBe(before);
    expect(s.dirty()).toBe('');
  });

  it('puts the tree back when the history cannot be written', () => {
    const s = sandbox(snapshot('tonight'));
    const result = s.run({ HISTORY_FAILS: '1' });

    expect(result.status).not.toBe(0);
    expect(s.shipped(join(DATA, 'index.json'))).toBe(
      snapshot('yesterday').trim(),
    );
    expect(s.dirty()).toBe('');
  });
});

/**
 * scripts/refresh/watchdog.sh. Freshness used to be the whole of it, and a
 * refresh that runs on time and publishes half an index passed every check
 * there was: on 2026-10-28 two of the five boards that build the Overall
 * published about half their rows, 65 ranked models became 41, and this
 * script said "没事" for three days.
 *
 * `curl` and `date` are stand-ins. `date -j` is BSD and CI is Linux, and
 * the date path is not what is under test here — the coverage decision is.
 * No mail can leave: with BUGSCAN_DIGEST set the script appends to that
 * file, which is also how it runs under the noon scan.
 */
describe('scripts/refresh/watchdog.sh', { timeout: 30_000 }, () => {
  const WATCHDOG = join(process.cwd(), 'scripts', 'refresh', 'watchdog.sh');

  function watcher() {
    root = mkdtempSync(join(tmpdir(), 'watchdog-'));
    const bin = join(root, 'bin');
    mkdirSync(bin);
    const stub = (name: string, body: string) => {
      writeFileSync(join(bin, name), `#!/bin/sh\n${body}\n`);
      chmodSync(join(bin, name), 0o755);
    };
    stub('curl', 'cat "$WATCHDOG_BODY"');
    // Only the three forms the script asks for, read as UTC.
    stub(
      'date',
      `case "$1" in
  +%s) exec node -e 'process.stdout.write(String(Math.floor(Date.now()/1e3)))' ;;
  -j) exec node -e 'process.stdout.write(String(Date.parse(process.argv[1]+"Z")/1e3))' "$4" ;;
  -r) exec node -e 'process.stdout.write(new Date(+process.argv[1]*1e3).toISOString())' "$2" ;;
esac`,
    );
    const digest = join(root, 'digest.md');
    return {
      said: () => (existsSync(digest) ? readFileSync(digest, 'utf8') : ''),
      /** One run against a published index that ranks `ranked` models. */
      run: (ranked: number) => {
        const body = join(root, 'body.json');
        writeFileSync(
          body,
          `{"generatedAt":"${new Date().toISOString()}","scope":"Overall",` +
            `"total":344,"scopeTotal":${ranked},"models":[{"ranked":true}]}`,
        );
        return spawnSync('bash', [WATCHDOG], {
          encoding: 'utf8',
          env: {
            ...process.env,
            PATH: `${bin}:${process.env.PATH}`,
            HOME: root,
            REFRESH_STATE: join(root, 'state'),
            BUGSCAN_DIGEST: digest,
            WATCHDOG_BODY: body,
          },
        });
      },
    };
  }

  it('speaks up when the index quietly stops ranking a third of its models', () => {
    const w = watcher();
    // Nothing to compare the first reading with; it is only recorded.
    expect(w.run(65).status).toBe(0);
    expect(w.said()).toBe('');

    const dropped = w.run(41);
    expect(dropped.status).not.toBe(0);
    expect(w.said()).toContain('65 → 41');
    // One event, one mail: tomorrow compares against 41, not against 65,
    // or a deliberate change to the rules would be re-announced for ever.
    expect(w.run(43).status).toBe(0);
  });

  it('keeps quiet about a move no larger than a board changing generation', () => {
    const w = watcher();
    w.run(66);
    // -13.6%: LiveBench 2.0 replacing 1.0 on 2026-10-13, which a person did.
    expect(w.run(57).status).toBe(0);
    expect(w.said()).toBe('');
  });
});
