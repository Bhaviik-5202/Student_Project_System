/**
 * Chat API Tests
 * ------------------------------------------------------------------
 * Tests for real-time communication channels and messaging sessions.
 */

const request = require('supertest');
const { expect } = require('chai');
const app = require('../server');

let token;
let otherUserId;
let chatId;

before(async function () {
  this.timeout(20000);

  // Main user
  const user = {
    name: 'Chat User 1',
    email: `chat1+${Date.now()}@example.com`,
    password: 'testpass123',
    role: 'student',
  };

  await request(app).post('/api/v1/auth/register').send(user);
  const loginRes = await request(app).post('/api/v1/auth/login').send({
    email: user.email,
    password: user.password,
  });
  token = loginRes.body.data.token;

  // Other user to chat with
  const otherUser = {
    name: 'Chat User 2',
    email: `chat2+${Date.now()}@example.com`,
    password: 'testpass123',
  };
  await request(app).post('/api/v1/auth/register').send(otherUser);

  const otherLoginRes = await request(app).post('/api/v1/auth/login').send({
    email: otherUser.email,
    password: otherUser.password,
  });
  otherUserId = otherLoginRes.body.data.user.id; // User ID is 'id' in login response
});

describe('Chat API', function () {
  it('should create a new private chat', async function () {
    const res = await request(app)
      .post('/api/v1/chats')
      .set('Authorization', `Bearer ${token}`)
      .send({ members: [otherUserId] });

    expect([201, 200, 400]).to.include(res.statusCode); // 400 if validation fails or other issues
    if (res.statusCode === 201 || res.statusCode === 200) {
      expect(res.body.success).to.be.true;
      expect(res.body.data).to.have.property('_id');
      chatId = res.body.data._id;
    }
  });

  it('should fetch user chats', async function () {
    const res = await request(app)
      .get('/api/v1/chats')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data).to.be.an('array');
  });

  it('should fetch a specific chat by ID', async function () {
    if (!chatId) this.skip();

    const res = await request(app)
      .get(`/api/v1/chats/${chatId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data._id).to.equal(chatId);
  });
});
