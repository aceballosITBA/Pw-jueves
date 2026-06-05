#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');
const { spawnSync } = require('child_process');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('Missing DATABASE_URL in .env.local');
  process.exit(1);
}

(async () => {
  const pool = new Pool({ connectionString });
  try {
    console.log('Conectando a la base...');
    await pool.connect();

    const tables = ['orders', 'order_items', 'order_status_history'];
    for (const t of tables) {
      console.log(`Aplicando GRANTs en public.${t}...`);
      const sql = `GRANT SELECT ON public.${t} TO anon; GRANT SELECT ON public.${t} TO service_role;`;
      await pool.query(sql);
    }

    console.log('GRANTs aplicados correctamente.');
  } catch (err) {
    console.error('Error aplicando GRANTs:', err.message || err);
    await pool.end();
    process.exit(1);
  }

  await pool.end();

  console.log('Iniciando migración de pedidos: npm run migrate:orders');
  const res = spawnSync('npm', ['run', 'migrate:orders'], { stdio: 'inherit', shell: process.platform === 'win32' });
  process.exit(res.status || 0);
})();
