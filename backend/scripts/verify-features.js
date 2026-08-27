/**
 * Verification test for newly added backend APIs
 */
require('dotenv').config();
const { query } = require('../src/config/db');

async function testAPIs() {
  console.log('--- Testing Database & API Controller Logic ---');

  // Test 1: listMovies with pagination & search
  const movieCtrl = require('../src/controllers/movieController');
  let resData;
  const mockRes = {
    json: (d) => { resData = d; },
    status: () => mockRes,
  };

  await movieCtrl.listMovies({ query: { search: 'Nebula', minRating: 7, limit: 5 } }, mockRes);
  console.log('Search "Nebula": found', resData.movies.length, 'total:', resData.pagination.total);
  if (!resData.movies.length || resData.movies[0].title !== 'Nebula Drift') {
    throw new Error('Search failed to find Nebula Drift');
  }

  // Test 2: listShowsForMovie with date
  const showCtrl = require('../src/controllers/showController');
  const showsRes = { json: (d) => { resData = d; } };
  await showCtrl.listShowsForMovie({ params: { movieId: 'a1111111-1111-1111-1111-111111111111' }, query: {} }, showsRes);
  console.log('Shows for Nebula Drift:', resData.length, 'shows found. Theater address:', resData[0]?.theater_address);
  if (!resData.length || !resData[0].theater_address) {
    throw new Error('Shows list missing theater_address or shows');
  }

  // Test 3: Favorites API
  const favCtrl = require('../src/controllers/favoriteController');
  const user_id = '22222222-2222-2222-2222-222222222222'; // Jane Doe
  const movie_id = 'a1111111-1111-1111-1111-111111111111';

  // Add favorite
  await favCtrl.addFavorite({ params: { movieId: movie_id }, user: { id: user_id } }, mockRes);
  console.log('Add favorite result:', resData);

  // Check favorite
  await favCtrl.checkFavorite({ params: { movieId: movie_id }, user: { id: user_id } }, mockRes);
  console.log('Check favorite result:', resData);
  if (!resData.isFavorite) throw new Error('Favorite check should be true');

  // List favorites
  await favCtrl.listFavorites({ user: { id: user_id } }, mockRes);
  console.log('List favorites count:', resData.length);
  if (resData.length !== 1 || resData[0].id !== movie_id) throw new Error('List favorites failed');

  // Remove favorite
  await favCtrl.removeFavorite({ params: { movieId: movie_id }, user: { id: user_id } }, mockRes);
  await favCtrl.checkFavorite({ params: { movieId: movie_id }, user: { id: user_id } }, mockRes);
  console.log('Check favorite after remove:', resData);
  if (resData.isFavorite) throw new Error('Favorite check should be false after removal');

  console.log('\nALL BACKEND API UNIT TESTS PASSED!');
  process.exit(0);
}

testAPIs().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
