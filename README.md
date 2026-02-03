# Testing Backend Engineer

## commands
npm install mongoose mongodb-memory-server nodemon jest supertest

## API List
### new profile
curl --location 'http://localhost:3000/profile' \
--header 'Content-Type: application/json' \
--data '{
    "name": "Wart User",
    "description": "Bar Yeah lives in the world of Bar Yeah.",
    "mbti": "ASTJ",
    "enneagram": "9w3",
    "variant": "sp/so",
    "tritype": 725,
    "socionics": "SEE",
    "sloan": "RCOEN",
    "psyche": "FEVL",
    "image": "https://soulverse.boo.world/images/1.png"
  }'

### fetch profile
curl --location 'http://localhost:3000/profile/698163051b67d96fde984bc2'

### new impression
curl --location 'http://localhost:3000/profile/impression-post' \
--header 'Content-Type: application/json' \
--data '{
    "receiverId": "698163051b67d96fde984bc2",
    "mbti": "intj",
    "zodiac": "virgo",
    "voter": "Raul",
    "comment": "Test comment"
}'

### update impression
curl --location 'http://localhost:3000/profile/impression-post' \
--header 'Content-Type: application/json' \
--data '{
    "impressionId": "69817325156d451a10bab016",
    "like": false
}'

### fetch impression
curl --location 'http://localhost:3000/profile/impression' \
--header 'Content-Type: application/json' \
--data '{
    "receiverId": "698172f6156d451a10bab006",
    "page": 1,
    "limit": 5,
    "sort": "vote",
    "mbti": "entj",
    "zodiac": "Scorpio",
    "enneagram": "8w2"
}'