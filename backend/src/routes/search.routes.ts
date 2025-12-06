/**
 * Search Routes
 * Handles resume/profile search and discovery
 */

import { Router, Request, Response } from 'express';
import { searchService } from '../services/searchService';

const router = Router();

/**
 * POST /api/search
 * Search resumes with query and filters
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { query = '', filters = {} } = req.body;

    const results = await searchService.searchResumes(query, filters);

    res.json({
      success: true,
      data: {
        results,
        count: results.length,
      },
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Search failed',
    });
  }
});

/**
 * GET /api/search/suggestions
 * Get search suggestions (autocomplete)
 */
router.get('/suggestions', async (req: Request, res: Response) => {
  try {
    const { q = '', type = 'skills' } = req.query;

    if (!q || typeof q !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Query parameter required',
      });
      return;
    }

    const suggestions = await searchService.getSearchSuggestions(
      q,
      type as 'skills' | 'locations' | 'titles'
    );

    res.json({
      success: true,
      data: {
        suggestions,
      },
    });
  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get suggestions',
    });
  }
});

/**
 * GET /api/search/trending
 * Get trending skills
 */
router.get('/trending', async (_req: Request, res: Response) => {
  try {
    const trendingSkills = await searchService.getTrendingSkills();

    res.json({
      success: true,
      data: {
        trendingSkills,
      },
    });
  } catch (error) {
    console.error('Trending error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get trending skills',
    });
  }
});

/**
 * GET /api/search/popular
 * Get popular searches
 */
router.get('/popular', async (_req: Request, res: Response) => {
  try {
    const popularSearches = await searchService.getPopularSearches();

    res.json({
      success: true,
      data: {
        searches: popularSearches,
      },
    });
  } catch (error) {
    console.error('Popular searches error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get popular searches',
    });
  }
});

export default router;
