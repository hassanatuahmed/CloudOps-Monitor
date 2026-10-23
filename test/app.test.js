const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src/app');

async function withServer(t, run) {
  const server = app.listen(0, '127.0.0.1');
  t.after(() => new Promise((resolve) => server.close(resolve)));
  await new Promise((resolve) => server.once('listening', resolve));
  await run(`http://127.0.0.1:${server.address().port}`);
}

test('GET / returns welcome information', async (t) => {
  await withServer(t, async (base) => {
    const response = await fetch(`${base}/`);
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.match(body.message, /CloudOps Monitor/);
    assert.equal(body.version, '1.0.0');
  });
});

test('GET /health returns healthy status', async (t) => {
  await withServer(t, async (base) => {
    const response = await fetch(`${base}/health`);
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.status, 'healthy');
    assert.equal(typeof body.uptimeSeconds, 'number');
  });
});

test('GET /info returns runtime information', async (t) => {
  await withServer(t, async (base) => {
    const response = await fetch(`${base}/info`);
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.name, 'CloudOps Monitor');
    assert.equal(body.environment, 'development');
    assert.ok(body.nodeVersion.startsWith('v'));
  });
});

test('GET /version returns application name and version', async (t) => {
  await withServer(t, async (base) => {
    const response = await fetch(`${base}/version`);
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.name, 'CloudOps Monitor');
    assert.equal(body.version, '1.0.0');
  });
});

test('unknown routes return JSON 404', async (t) => {
  await withServer(t, async (base) => {
    const response = await fetch(`${base}/missing`);
    const body = await response.json();
    assert.equal(response.status, 404);
    assert.equal(body.error, 'Not found');
  });
});
