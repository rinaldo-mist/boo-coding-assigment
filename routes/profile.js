'use strict';

const express = require('express');
const Profile = require('../model/profile.js');
const Impression = require('../model/impression.js');
const { default: mongoose } = require('mongoose');
const router = express.Router();

const profiles = [
  {
    "id": 1,
    "name": "A Martinez",
    "description": "Adolph Larrue Martinez III.",
    "mbti": "ISFJ",
    "enneagram": "9w3",
    "variant": "sp/so",
    "tritype": 725,
    "socionics": "SEE",
    "sloan": "RCOEN",
    "psyche": "FEVL",
    "image": "https://soulverse.boo.world/images/1.png",
  }
];

module.exports = function() {

  router.get('/', async function(req, res, next) {
    await Profile.find({}).lean().then(data => res.status(200).json(data));
  });
  router.get('/impression', async function(req, res, next) {
    await Impression.find({}).lean().then(data => res.status(200).json(data));
  });

  router.get('/profile/:id', async function(req, res, next) {
    const id = req.params.id;
    await Profile.findById(id).lean().then(data =>{
        res.render('profile_template', {
        profile: data,
      });
    }).catch(err => res.status(500).json({ message: `error found : ${err}` }));    
  });

  router.post('/profile', async function(req, res, next) {
    const newProfile = new Profile(req.body);
    await Profile.create(newProfile).then(data =>{
        res.status(200).json(data);
    }).catch(err => res.status(500).json({ message: `error found : ${err}` }));    
  });

  router.post('/profile/impression', async function(req, res, next) {
    try {
      const body = req.body || {};
      const receiverId = body.receiverId;
      const mbti = body.mbti;
      const enneagram = body.enneagram;
      const zodiac = body.zodiac;

      const sort = body.sort && typeof body.sort === 'string' && body.sort.trim() !== '' ? body.sort : 'recent';

      const cursor = body.cursor;
      const voteCursor = body.voteCursor

      const page = body.page;
      const limit = body.limit;
      const skip = (page - 1) * limit;

       // fetch receiver profile
      const receiver = await Profile.findById(receiverId).lean();
      if (!receiver) {
        return res.status(404).json({ message: 'Profile not found' });
      }

      // build impression query
      const query = {
        profileId: new mongoose.Types.ObjectId(receiverId)
      };
      
      let sortStage;

      if (sort === 'vote') {
        sortStage = { vote: -1, createdAt: -1 };

        if (cursor && voteCursor !== undefined) {
          query.$or = [
            { vote: { $lt: Number(voteCursor) } },
            {
              vote: Number(voteCursor),
              createdAt: { $lt: new Date(cursor) }
            }
          ];
        }
      } else {
        // recent (default)
        sortStage = { createdAt: -1 };

        if (cursor) {
          query.createdAt = { $lt: new Date(cursor) };
        }
      }

      // apply filters ONLY if requested
      if (typeof mbti === 'string' && mbti.trim() !== '') {
        query.mbti = mbti.trim().toUpperCase();
      }

      if (typeof zodiac === 'string' && zodiac.trim() !== '') {
        query.zodiac = zodiac.trim().toUpperCase();
      }

      if (enneagram !== undefined && enneagram.trim() !== null) {
        query.enneagram = enneagram.trim().toUpperCase();
      }

      // fetch impression (child)
      const impressions = await Impression.find(query)
      .sort(sortStage)
      .limit(limit)
      .lean();

      let nextCursor = null;

      if (impressions.length > 0) {
        const last = impressions[impressions.length - 1];

        nextCursor = sort === 'vote' ? {
          vote: last.vote,
          createdAt: last.createdAt
        } : {
          createdAt: last.createdAt
        }
      }
      
      res.status(200).json({
        receiver,
        impressions,
        nextCursor
      });

    } catch (err) {
      res.status(500).json({ message: `error found : ${err}` });
    }
  });

  router.post('/profile/impression-post', async function(req, res, next) {
    // check if impression id exists, this means it's updating like/dislike comment
    // if not exists , it means create new impression
    const id = req.body.impressionId;
    if (id !== undefined || id != null ) {
      const id = req.body.impressionId;
      const voteCt = req.body.like === true ? 1 : -1 ;

      // check profile exists
      const impressionExists = await Impression.exists({ _id: id});
      if (!impressionExists) {
        res.status(404).json({ message: `impression not found` });
      }

      const updated = await Impression.findByIdAndUpdate(
        {
          _id: id,
          vote: { $gt: 0 }
        },
        { $inc: { vote: voteCt } }, // atomic increment
        { new: true, select: 'vote' }
      ).then(data =>{
          res.status(200).json(data);
      }).catch(err => res.status(500).send(`error found : ${err}`));
    } else {
      const receiverId = req.body.receiverId;
    
      const newImpression = new Impression(req.body);

      // check profile exists
      const profileExists = await Profile.exists({ _id: receiverId});
      if (!profileExists) {
        res.status(404).json({ message: `error found : ${err}` });
      }
      
      const vote = req.body.fav === undefined || !req.body.fav ? 0 : 1 ;

      // populate new impression
      newImpression.profileId = receiverId;
      newImpression.vote = vote;

      await Impression.create(newImpression).then(data =>{
          res.status(200).json(data);
      }).catch(err => res.status(500).send(`error found : ${err}`));
    }    
  });

  return router;
}

