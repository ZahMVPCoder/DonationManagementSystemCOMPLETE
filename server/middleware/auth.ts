import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

/**
 * Extended Express Request interface that includes authenticated user data
 * Used on protected routes after token verification
 */
export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

/**
 * JWT Token Verification Middleware
 *
 * Verifies JWT token from Authorization header and attaches user data to request.
 * Should be applied to all protected routes except /api/auth/login and /api/auth/register
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 *
 * Returns:
 * - 401 if no token provided
 * - 401 if token is invalid or expired
 * - Calls next() and attaches user to req if token is valid
 *
 * Expected Authorization header format: "Bearer <token>"
 */
export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Extract token from Authorization header (format: "Bearer <token>")
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    // Check if token is provided
    if (!token) {
      res.status(401).json({
        error: 'No token provided',
        message: 'Authorization header with Bearer token is required',
      });
      return;
    }

    // Verify and decode JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      email: string;
    };

    // Attach user data to request for use in route handlers
    req.user = decoded;

    // Continue to next middleware/route handler
    next();
  } catch (error) {
    // Handle JWT verification errors
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        error: 'Token expired',
        message: 'Your session has expired. Please log in again.',
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        error: 'Invalid token',
        message: 'The provided token is invalid or malformed.',
      });
    } else {
      res.status(401).json({
        error: 'Authentication failed',
        message: 'An error occurred during token verification.',
      });
    }
  }
};

/**
 * Optional: Middleware to handle 401 Unauthorized responses
 * Can be used globally for consistent error responses
 */
export const handleUnauthorized = (err: any, req: Request, res: Response, next: NextFunction): void => {
  if (err.status === 401) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required to access this resource.',
    });
  } else {
    next(err);
  }
};
