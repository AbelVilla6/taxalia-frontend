import { existsSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const startedAt = new Date();
const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const entryPath = resolve(rootDir, 'dist/server/entry.mjs');
const distPath = resolve(rootDir, 'dist');
const serverPath = resolve(rootDir, 'dist/server');

const log = (message, extra = {}) => {
  const details = Object.keys(extra).length > 0 ? ` ${JSON.stringify(extra)}` : '';
  console.log(`[startup] ${new Date().toISOString()} ${message}${details}`);
};

const logDirectory = (label, path) => {
  if (!existsSync(path)) {
    log(`${label} missing`, { path });
    return;
  }

  log(`${label} found`, {
    path,
    entries: readdirSync(path).slice(0, 30),
  });
};

process.on('uncaughtException', (error) => {
  console.error('[startup] uncaughtException', error);
  process.exitCode = 1;
});

process.on('unhandledRejection', (reason) => {
  console.error('[startup] unhandledRejection', reason);
  process.exitCode = 1;
});

log('starting Astro server', {
  node: process.version,
  platform: process.platform,
  arch: process.arch,
  cwd: process.cwd(),
  rootDir,
  port: process.env.PORT ?? null,
  host: process.env.HOST ?? null,
  nodeEnv: process.env.NODE_ENV ?? null,
});

logDirectory('dist directory', distPath);
logDirectory('server directory', serverPath);

if (!existsSync(entryPath)) {
  console.error(`[startup] Missing Astro server entry: ${entryPath}`);
  console.error('[startup] Did the Hostinger build publish the dist/server directory?');
  process.exit(1);
}

const child = spawn(process.execPath, [entryPath], {
  cwd: rootDir,
  env: process.env,
  stdio: 'inherit',
});

let shutdownTimer;

const forwardSignal = (signal) => {
  log('received shutdown signal, forwarding to Astro server', { signal });

  if (child.exitCode !== null || child.killed) {
    process.exit(0);
  }

  child.kill(signal);
  shutdownTimer = setTimeout(() => {
    console.error('[startup] Astro server did not stop in time; forcing shutdown');
    child.kill('SIGKILL');
  }, 10_000);
  shutdownTimer.unref();
};

for (const signal of ['SIGTERM', 'SIGINT', 'SIGHUP']) {
  process.once(signal, () => forwardSignal(signal));
}

child.on('error', (error) => {
  console.error('[startup] failed to launch Astro server entry', error);
  process.exit(1);
});

child.on('exit', (code, signal) => {
  if (shutdownTimer) {
    clearTimeout(shutdownTimer);
  }

  log('Astro server process exited', {
    code,
    signal,
    uptimeSeconds: Math.round((Date.now() - startedAt.getTime()) / 1000),
  });

  if (signal) {
    process.exit(128 + (signal === 'SIGINT' ? 2 : signal === 'SIGTERM' ? 15 : 1));
    return;
  }

  process.exit(code ?? 0);
});
