const request = require('supertest');
const app = require('../app');

describe('Profile API', () => {
  it('should create a new profile', async () => {
    const res = await request(app)
      .post('/profile')
      .send({
        name: "A Martinez",
        description: "Adolph Larrue Martinez III.",
        mbti: "ISFJ",
        enneagram: "9w3",
        variant: "sp/so",
        tritype: 725,
        socionics: 'SEE',
        sloan: 'RCOEN',
        psyche: 'FEVL',
        image: 'https://soulverse.boo.world/images/1.png'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBeDefined();
    expect(res.body.mbti).toBe('ISFJ');
  });

  it('should fetch profile by id', async () => {
    const create = await request(app)
      .post('/profile')
      .send({ name: 'Test', image: 'x' });

    const id = create.body._id;

    console.log(id);

    const res = await request(app)
      .get(`/profile/${id}`);

    expect(res.statusCode).toBe(200);
  });
});