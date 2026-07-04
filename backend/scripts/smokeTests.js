const axios = require('axios');
const baseURL = process.env.API_BASE || 'http://localhost:5000/api/v1';

const client = axios.create({ baseURL, validateStatus: () => true });

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function registerAndLogin() {
  const timestamp = Date.now();
  const email = `smoke.test+${timestamp}@example.com`;
  const password = 'Password123!';
  const name = 'Smoke Tester';

  console.log('Registering test user:', email);
  let res = await client.post('/auth/register', { name, email, password });
  console.log('/auth/register', res.status);

  // If already exists or validation failed, still try login
  res = await client.post('/auth/login', { email, password });
  console.log('/auth/login', res.status);
  if (res.status !== 200 && res.status !== 201) {
    console.error('Login failed', res.status, res.data);
    return null;
  }
  const token = res.data && (res.data.token || res.data.data && res.data.data.token) || res.data.data?.token;
  // fallback: some endpoints return { success, message, data: { token, user }}
  let authToken = token;
  if (!authToken && res.data && res.data.data && res.data.data.token) authToken = res.data.data.token;
  if (!authToken && res.data && res.data.token) authToken = res.data.token;

  if (!authToken && res.headers && res.headers.authorization) authToken = res.headers.authorization;
  return { email, password, token: authToken };
}

async function testCrud(path, sampleCreate = {}) {
  const result = { path, create: null, list: null, get: null, update: null, delete: null };
  // LIST
  try {
    const r = await client.get(path);
    result.list = { status: r.status, ok: r.status < 400, dataType: typeof r.data };
  } catch (e) {
    result.list = { error: e.message };
  }
  // CREATE
  try {
    const r = await client.post(path, sampleCreate);
    result.create = { status: r.status, body: r.data };
    if (r.data && (r.data.data || r.data._id)) result.createdId = (r.data.data && r.data.data._id) || r.data._id || (r.data.data && r.data.data.id);
  } catch (e) {
    result.create = { error: e.message };
  }
  // GET by id
  if (result.createdId) {
    try {
      const r = await client.get(`${path}/${result.createdId}`);
      result.get = { status: r.status, body: r.data };
    } catch (e) {
      result.get = { error: e.message };
    }
    // UPDATE
    try {
      const r = await client.put(`${path}/${result.createdId}`, { updatedBySmoke: true });
      result.update = { status: r.status, body: r.data };
    } catch (e) {
      result.update = { error: e.message };
    }
    // DELETE
    try {
      const r = await client.delete(`${path}/${result.createdId}`);
      result.delete = { status: r.status, body: r.data };
    } catch (e) {
      result.delete = { error: e.message };
    }
  }
  return result;
}

async function authTests() {
  const out = { register: null, login: null, logout: null };
  const timestamp = Date.now();
  const email = `smoke.auth+${timestamp}@example.com`;
  const password = 'Password123!';
  const name = 'Auth Smoke';

  const r1 = await client.post('/auth/register', { name, email, password });
  out.register = { status: r1.status, body: r1.data };
  const r2 = await client.post('/auth/login', { email, password });
  out.login = { status: r2.status, body: r2.data };
  if (r2.status === 200 || r2.status === 201) {
    const token = (r2.data && (r2.data.token || r2.data.data && r2.data.data.token)) || r2.data.data?.token;
    const headers = { Authorization: `Bearer ${token}` };
    const r3 = await client.post('/auth/logout', {}, { headers });
    out.logout = { status: r3.status, body: r3.data };
  }
  return out;
}

async function run() {
  console.log('API Base URL:', baseURL);
  const auth = await registerAndLogin();
  if (!auth || !auth.token) {
    console.error('Could not obtain auth token; aborting authenticated tests.');
  }
  const headers = auth && auth.token ? { Authorization: `Bearer ${auth.token}` } : {};

  client.defaults.headers.common = { ...client.defaults.headers.common, ...headers };

  const endpoints = [
    { path: '/projects', sample: { title: 'Smoke Project', description: 'Created by smoke test' } },
    { path: '/students', sample: { firstName: 'Smoke', lastName: 'Student', email: `smoke.stu+${Date.now()}@example.com` } },
    { path: '/staff', sample: { firstName: 'Smoke', lastName: 'Staff', email: `smoke.staff+${Date.now()}@example.com` } },
    { path: '/submissions', sample: { title: 'Smoke Submission' } },
    { path: '/meetings', sample: { title: 'Smoke Meeting', start: new Date().toISOString() } },
    { path: '/portfolios', sample: { name: 'Smoke Portfolio', description: 'test' } },
    { path: '/resources', sample: { title: 'Smoke Resource', url: '' } },
    { path: '/notifications', sample: { message: 'Smoke notification' } },
    { path: '/users', sample: { name: 'Smoke User', email: `smoke.user+${Date.now()}@example.com` } },
  ];

  // Attempt to discover an assignment to attach to submission tests
  try {
    const a = await client.get('/assignments');
    if (a && a.status === 200 && Array.isArray(a.data && a.data.data ? a.data.data : a.data)) {
      const list = a.data.data || a.data;
      if (list.length > 0) {
        const assignmentId = list[0]._id || list[0].id;
        // Find submissions endpoint and add assignment
        const sub = endpoints.find(e => e.path === '/submissions');
        if (sub) sub.sample.assignment = assignmentId;
      }
    }
  } catch (e) {
    // ignore
  }

  const results = { auth: null, endpoints: [] };
  results.auth = await authTests();

  for (const ep of endpoints) {
    console.log('Testing', ep.path);
    // LIST
    const rList = await client.get(ep.path);
    if (rList.status === 404) {
      console.log(ep.path, '→ 404');
      results.endpoints.push({ path: ep.path, error: '404' });
      continue;
    }

    // try CRUD with auth headers
    const res = await testCrud(ep.path, ep.sample);
    results.endpoints.push(res);
    await sleep(200);
  }

  console.log('\nSMOKE TEST SUMMARY:\n');
  console.log(JSON.stringify(results, null, 2));
  // write exit code
  const hasCritical = results.endpoints.some(e => e && ((e.list && e.list.status >= 500) || (e.create && e.create.status >= 500)) );
  process.exit(hasCritical ? 2 : 0);
}

run().catch(err => { console.error(err); process.exit(3); });
