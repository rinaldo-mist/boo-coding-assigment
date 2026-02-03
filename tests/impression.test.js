const request = require('supertest');
const app = require('../app');

describe('Impression API', () => {
  let profileId;
  let impressionId;

  beforeEach(async () => {
    const profile = await request(app)
      .post('/profile')
      .send({ name: 'Target', image: 'x' });

    profileId = profile.body._id;
  });

  it('should create an impression', async () => {
    const res = await request(app)
      .post('/profile/impression-post')
      .send({
        receiverId: profileId,
        mbti: 'intj',
        zodiac: 'virgo',
        voter: 'Raul',
        comment: 'Test comment'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.mbti).toBe('INTJ');
    impressionId = res.body._id;
  });

  it('should like and unlike impression', async () => {
    const imp = await request(app)
      .post('/profile/impression-post')
      .send({
        receiverId: profileId,
        voter: 'Raul',
        comment: 'Like test'
      });

    impressionId = imp.body._id;

    const like = await request(app)
      .post('/profile/impression-post')
      .send({
        impressionId,
        like: true
      });

    expect(like.body.vote).toBe(1);

    const unlike = await request(app)
      .post('/profile/impression-post')
      .send({
        impressionId,
        like: false
      });

    expect(unlike.body.vote).toBe(0);
  });

  it('should fetch impressions with filter & sort', async () => {
    await request(app)
      .post('/profile/impression-post')
      .send({
        receiverId: profileId,
        mbti: 'ENTJ',
        zodiac: 'Scorpio',
        enneagram: '8w2',
        voter: 'A',
        comment: 'Filtered'
      });

    const res = await request(app)
      .post('/profile/impression')
      .send({
        receiverId: profileId,
        mbti: 'entj',
        zodiac: 'scorpio',
        enneagram: '8w2',
        sort: 'vote',
        limit: 5,
        page: 1
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.impressions.length).toBe(1);
  });
});