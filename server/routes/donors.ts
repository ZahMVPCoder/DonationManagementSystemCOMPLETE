import express from 'express';
// @ts-ignore - Prisma types are generated but TS can't find them
import { PrismaClient } from '@prisma/client';
import { verifyToken, AuthRequest } from '../middleware/auth.js';
import type {
  CreateDonorRequest,
  UpdateDonorRequest,
  DonorWithDonations,
} from '../types/donor.js';

const router = express.Router();
const prisma = new PrismaClient();

// Middleware: Apply token verification to all donor routes
router.use(verifyToken);

/**
 * GET /api/donors
 * Get all donors with optional search and status filtering
 * Query params: search (name/email), status (active/lapsed/new), limit, offset
 */
router.get('/', async (req: AuthRequest, res) => {
  try {
    const {
      search,
      status,
      limit = '10',
      offset = '0',
    } = req.query as {
      search?: string;
      status?: string;
      limit?: string;
      offset?: string;
    };

    const limitNum = Math.min(parseInt(limit), 100);
    const offsetNum = parseInt(offset);

    // Build where clause for filtering
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status && ['active', 'lapsed', 'new'].includes(status)) {
      where.status = status;
    }

    // Fetch donors with donation count
    const [donors, total] = await Promise.all([
      prisma.donor.findMany({
        where,
        include: {
          _count: {
            select: { donations: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limitNum,
        skip: offsetNum,
      }),
      prisma.donor.count({ where }),
    ]);

    res.status(200).json({
      data: donors,
      pagination: {
        total,
        limit: limitNum,
        offset: offsetNum,
        hasMore: offsetNum + limitNum < total,
      },
    });
  } catch (error) {
    console.error('Get donors error:', error);
    res.status(500).json({
      error: 'Failed to fetch donors',
    });
  }
});

/**
 * GET /api/donors/:id
 * Get single donor with donation history
 */
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const donorId = parseInt(id);
    if (isNaN(donorId)) {
      return res.status(400).json({
        error: 'Invalid donor ID',
      });
    }

    const donor = await prisma.donor.findUnique({
      where: { id: donorId },
      include: {
        donations: {
          orderBy: { date: 'desc' },
          include: {
            campaign: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        tasks: {
          orderBy: { dueDate: 'desc' },
        },
        _count: {
          select: {
            donations: true,
            tasks: true,
          },
        },
      },
    });

    if (!donor) {
      return res.status(404).json({
        error: 'Donor not found',
      });
    }

    res.status(200).json({
      data: donor,
    });
  } catch (error) {
    console.error('Get donor error:', error);
    res.status(500).json({
      error: 'Failed to fetch donor',
    });
  }
});

/**
 * POST /api/donors
 * Create new donor
 */
router.post('/', async (req: AuthRequest, res) => {
  try {
    const { name, email, phone, status, notes } =
      req.body as CreateDonorRequest;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({
        error: 'Name and email are required',
      });
    }

    // Check if donor with this email already exists
    const existingDonor = await prisma.donor.findUnique({
      where: { email },
    });

    if (existingDonor) {
      return res.status(409).json({
        error: 'Donor with this email already exists',
      });
    }

    // Validate status if provided
    const validStatuses = ['active', 'lapsed', 'new'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Status must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const donor = await prisma.donor.create({
      data: {
        name,
        email,
        phone: phone || null,
        status: status || 'new',
        notes: notes || null,
      },
    });

    res.status(201).json({
      message: 'Donor created successfully',
      data: donor,
    });
  } catch (error) {
    console.error('Create donor error:', error);
    res.status(500).json({
      error: 'Failed to create donor',
    });
  }
});

/**
 * PATCH /api/donors/:id
 * Update donor
 */
router.patch('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, status, notes } = req.body as UpdateDonorRequest;

    const donorId = parseInt(id);
    if (isNaN(donorId)) {
      return res.status(400).json({
        error: 'Invalid donor ID',
      });
    }

    // Check if donor exists
    const existingDonor = await prisma.donor.findUnique({
      where: { id: donorId },
    });

    if (!existingDonor) {
      return res.status(404).json({
        error: 'Donor not found',
      });
    }

    // If email is being updated, check for duplicates
    if (email && email !== existingDonor.email) {
      const duplicateEmail = await prisma.donor.findUnique({
        where: { email },
      });

      if (duplicateEmail) {
        return res.status(409).json({
          error: 'Donor with this email already exists',
        });
      }
    }

    // Validate status if provided
    const validStatuses = ['active', 'lapsed', 'new'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Status must be one of: ${validStatuses.join(', ')}`,
      });
    }

    // Build update data (only include fields that were provided)
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone || null;
    if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes || null;

    const updatedDonor = await prisma.donor.update({
      where: { id: donorId },
      data: updateData,
      include: {
        _count: {
          select: { donations: true, tasks: true },
        },
      },
    });

    res.status(200).json({
      message: 'Donor updated successfully',
      data: updatedDonor,
    });
  } catch (error) {
    console.error('Update donor error:', error);
    res.status(500).json({
      error: 'Failed to update donor',
    });
  }
});

/**
 * DELETE /api/donors/:id
 * Delete donor (and all related donations and tasks cascade)
 */
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const donorId = parseInt(id);
    if (isNaN(donorId)) {
      return res.status(400).json({
        error: 'Invalid donor ID',
      });
    }

    // Check if donor exists
    const existingDonor = await prisma.donor.findUnique({
      where: { id: donorId },
      include: {
        _count: {
          select: { donations: true, tasks: true },
        },
      },
    });

    if (!existingDonor) {
      return res.status(404).json({
        error: 'Donor not found',
      });
    }

    // Delete the donor (cascade delete will handle donations and tasks)
    await prisma.donor.delete({
      where: { id: donorId },
    });

    res.status(200).json({
      message: 'Donor deleted successfully',
      data: {
        deletedId: donorId,
        deletedName: existingDonor.name,
        relatedDeletions: {
          donations: existingDonor._count.donations,
          tasks: existingDonor._count.tasks,
        },
      },
    });
  } catch (error) {
    console.error('Delete donor error:', error);
    res.status(500).json({
      error: 'Failed to delete donor',
    });
  }
});

export default router;
