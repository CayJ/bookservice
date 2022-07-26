const express = require('express');
const router = express.Router();
const https = require('https');

const apiKey = process.argv.slice(2)[0];

if (!apiKey)
{
  console.log('Please include an apiKey');
  process.exit();
  return;
}

console.log(`Service started using api key: ${apiKey}`);

router.get('/', function(req, res, next) {
  const title = req.query.title;
  const author = req.query.author;
  const genre = req.query.genre;

  if (!title && !author && !genre)
  {
    res.status(404).send('Please use at least one of the following GET queries: title, author, genre.');
  }

  const titleParam = title ? `intitle:${title}` : '';
  const authorParam = author ? (title ? '+' : '')+`inauthor:${author}` : '';
  const genreParam = genre ? (title || author ? '+' : '')+`subject:${genre}` : '';

  let requestUrl = `https://www.googleapis.com/books/v1/volumes?q=\
${titleParam}\
${authorParam}\
${genreParam}\
&key=${apiKey}`;

  console.log(`API url: ${requestUrl}`);

  https.get(requestUrl, (httpsRes) => {
    let body = '';

    httpsRes.setEncoding('utf8');

    httpsRes.on('data', (chunk) => {
      body += chunk;
    });

    httpsRes.on('end', () => {

      const jsonData = JSON.parse(body);

      if (!jsonData.items || Object.keys(jsonData.items).length < 1)
      {
        return res.send(`Could not find any books with the query: ${JSON.stringify(req.query)}`);
      }

      const topResult = jsonData.items[0].volumeInfo;
      const resTitle = topResult.title;
      const resAuthors = topResult.authors;
      const resCategories = topResult.categories;
      const resISBN = topResult.industryIdentifiers;
      const resAverageRating = topResult.averageRating;

      let jsonResponse = {
        "title" : resTitle,
        "authors" : resAuthors,
        "categories" : resCategories,
        "isbn" : resISBN,
        "averageRating" : resAverageRating
      };


      return res.send(jsonResponse);
    });
  }).on('error', function(e) {
    console.log("error fetching book: " + e.message);
  });

  req.on('error', (e) => {
    console.error(`error with request: ${e.message}`);
  });
});

module.exports = router;
