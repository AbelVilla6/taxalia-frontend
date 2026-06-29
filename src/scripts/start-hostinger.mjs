console.log('[BOOT] Starting Astro app on Hostinger');
console.log('[ENV]', {
  NODE_ENV: process.env.NODE_ENV,
  HOST: process.env.HOST,
  PORT_EXISTS: Boolean(process.env.PORT),
  PORT: process.env.PORT
});

await import('../dist/server/entry.mjs');

////"start": "HOST=0.0.0.0 PORT=8080 NODE_ENV=production node dist/server/entry.mjs",
   