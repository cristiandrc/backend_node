const express = require('express');
const MoviesService = require('../services/movies');

const {
  movieIdSchema,
  createMovieSchema,
  updateMovieSchema,
} = require('../utils/schemas/movies');

const validationHandler = require('../utils/middleware/validationHandlers');
const cacheResponse = require('../utils/cacheResponse.js');
const {
  FIVE_MINUTES_IN_SECONDS,
  SIXTY_MINUTES_IN_SECONDS,
} = require('../utils/times');

function moviesApi(app) {
  const router = express.Router();
  app.use('/api/movies', router);
  const moviesServices = new MoviesService();

  router.get('/', async (req, res, next) => {
    cacheResponse(res, FIVE_MINUTES_IN_SECONDS);
    const { tags } = req.query;
    try {
      const movies = await moviesServices.getMovies({ tags });
      // throw new Error('error getting movies');
      res.status(200).json({
        data: movies,
        message: 'movies listed',
      });
    } catch (err) {
      next(err);
    }
  });

  router.get(
    '/:movieId',
    validationHandler({ movieId: movieIdSchema }, 'params'),
    async (req, res, next) => {
      const { movieId } = req.params;
      try {
        const movies = await moviesServices.getMovie({ movieId });
        res.status(200).json({
          data: movies,
          message: 'movie retrieved',
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.post(
    '/',
    validationHandler(createMovieSchema),
    async (req, res, next) => {
      const { body: movie } = req;
      try {
        const createMovieId = await moviesServices.createMovie({ movie });
        res.status(201).json({
          data: createMovieId,
          message: 'movie created',
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.put(
    '/:movieId',
    validationHandler({ movieId: movieIdSchema }),
    validationHandler(updateMovieSchema),
    async (req, res, next) => {
      cacheResponse(res, SIXTY_MINUTES_IN_SECONDS);

      const { movieId } = req.params;
      const { body: movie } = req;

      try {
        const updateMovieId = await moviesServices.updateMovie({
          movieId,
          movie,
        });
        res.status(200).json({
          data: updateMovieId,
          message: 'movie updated',
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.delete(
    '/:movieId',
    validationHandler({ movieId: movieIdSchema }),
    async (req, res, next) => {
      const { movieId } = req.params;

      try {
        const deleteMovieId = await moviesServices.deleteMovie({ movieId });
        res.status(200).json({
          data: deleteMovieId,
          message: 'movie deleted',
        });
      } catch (err) {
        next(err);
      }
    }
  );
}

module.exports = moviesApi;
