import express from 'express';
// @ts-ignore - Prisma types are generated but TS can't find them
import { PrismaClient } from '@prisma/client';
import { verifyToken, AuthRequest } from '../middleware/auth.js';
import type {
  CreateDonationRequest,
  UpdateDonationRequest,
  DonationResponse,
  TaskCreatedResponse,
} from '../types/donation.js';

const router = express.Router();
const prisma = new PrismaClient();

// Middleware: Apply token verification to all donation routes
router.use(verifyToken);

/**
 * GET /api/donations
 * Get all donations with optional filters
 * Query params: donorId, campaignId, method, limit, offset
 */
router.get('/', async (req: AuthRequest, res) => {
  try {
    const {
      donorId,
      campaignId,
      method,
      limit = '10',
      offset = '0',
    } = req.query as {
      donorId?: string;
      campaignId?: string;
      method?: string;
      limit?: string;
      offset?: string;
    };

    const limitNum = Math.min(parseInt(limit), 100);
    const offsetNum = parseInt(offset);

    // Build where clause for filtering
    const where: any = {};

    if (donorId) {
      const donorIdNum = parseInt(donorId);
      if (!isNaN(donorIdNum)) {
        where.donorId = donorIdNum;
      }
    }

    if (campaignId) {
      const campaignIdNum = parseInt(campaignId);
      if (!isNaN(campaignIdNum)) {
        where.campaignId = campaignIdNum;
      }
    }

    if (method) {
      where.method = { contains: method, mode: 'insensitive' };
    }

    // Fetch donations with related data
    const [donations, total] = await Promise.all([
      prisma.donation.findMany({
        where,
        include: {
          donor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          campaign: {
            select: {
              id: true,
              name: true,
              goal: true,
              raised: true,
            },
          },
        },
        orderBy: { date: 'desc' },
        take: limitNum,
        skip: offsetNum,
      }),
      prisma.donation.count({ where }),
    ]);

    res.status(200).json({
      data: donations,
      pagination: {
        total,
        limit: limitNum,
        offset: offsetNum,
        hasMore: offsetNum + limitNum < total,
      },
    });
  } catch (error) {
    console.error('Get donations error:', error);
    res.status(500).json({
      error: 'Failed to fetch donations',
    });
  }
});

/**
 * GET /api/donations/:id
 * Get single donation with related donor and campaign info
 */
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const donationId = parseInt(id);
    if (isNaN(donationId)) {
      return res.status(400).json({
        error: 'Invalid donation ID',
      });
    }

    const donation = await prisma.donation.findUnique({
      where: { id: donationId },
      include: {
        donor: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            status: true,
          },
        },
        campaign: {
          select: {
            id: true,
            name: true,
            goal: true,
            raised: true,
            status: true,
          },
        },
      },
    });

    if (!donation) {
      return res.status(404).json({
        error: 'Donation not found',
      });
    }

    res.status(200).json({
      data: donation,
    });
  } catch (error) {
    console.error('Get donation error:', error);
    res.status(500).json({
      error: 'Failed to fetch donation',
    });
  }
});

/**
 * Helper function to create a thank you task
 */
async function createThankYouTask(donorId: number) {
  try {
    // Calculate due date (7 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    const task = await prisma.task.create({
      data: {
        type: 'thank-you',
        description: 'Send thank you message for donation',
        dueDate,
        priority: 'high',
        completed: false,
        donorId,
      },
    });

    return task;
  } catch (error) {
    console.error('Error creating thank you task:', error);
    // Don't throw - continue even if task creation fails
    return null;
  }
}

/**
 * Helper function to update campaign raised amount
 */
async function updateCampaignRaisedAmount(
  campaignId: number,
  amount: number
) {
  try {
    await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        raised: {
          increment: amount,
        },
      },
    });
  } catch (error) {
    console.error('Error updating campaign raised amount:', error);
    // Don't throw - continue even if campaign update fails
  }
}

/**
 * POST /api/donations
 * Create new donation and automatically create a thank you task
 */
router.post('/', async (req: AuthRequest, res) => {
  try {
    const { amount, date, method, donorId, campaignId, recurring, notes } =
      req.body as CreateDonationRequest;

    // Validate required fields
    if (!amount || !date || !method || !donorId) {
      return res.status(400).json({
        error: 'Amount, date, method, and donorId are required',
      });
    }

    // Validate amount
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({
        error: 'Amount must be a positive number',
      });
    }

    // Validate date format
    const donationDate = new Date(date);
    if (isNaN(donationDate.getTime())) {
      return res.status(400).json({
        error: 'Invalid date format. Use ISO 8601 format (YYYY-MM-DD)',
      });
    }

    // Check if donor exists
    const donor = await prisma.donor.findUnique({
      where: { id: donorId },
    });

    if (!donor) {
      return res.status(404).json({
        error: 'Donor not found',
      });
    }

    // Check if campaign exists (if provided)
    if (campaignId) {
      const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId },
      });

      if (!campaign) {
        return res.status(404).json({
          error: 'Campaign not found',
        });
      }
    }

    // Create donation and thank you task in a transaction
    const donation = await prisma.donation.create({
      data: {
        amount,
        date: donationDate,
        method,
        recurring: recurring || false,
        thanked: false,
        notes: notes || null,
        donorId,
        campaignId: campaignId || null,
      },
      include: {
        donor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        campaign: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Create thank you task in background (don't wait for it)
    createThankYouTask(donorId);

    // Update campaign raised amount if campaign is linked
    if (campaignId) {
      updateCampaignRaisedAmount(campaignId, amount);
    }

    res.status(201).json({
      message: 'Donation created successfully',
      data: donation,
      taskCreated: true,
      taskInfo: {
        type: 'thank-you',
        description: 'Send thank you message for donation',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
  } catch (error) {
    console.error('Create donation error:', error);
    res.status(500).json({
      error: 'Failed to create donation',
    });
  }
});

/**
 * PATCH /api/donations/:id
 * Update donation
 */
router.patch('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { amount, date, method, campaignId, recurring, thanked, notes } =
      req.body as UpdateDonationRequest;

    const donationId = parseInt(id);
    if (isNaN(donationId)) {
      return res.status(400).json({
        error: 'Invalid donation ID',
      });
    }

    // Check if donation exists
    const existingDonation = await prisma.donation.findUnique({
      where: { id: donationId },
    });

    if (!existingDonation) {
      return res.status(404).json({
        error: 'Donation not found',
      });
    }

    // Validate amount if provided
    if (amount !== undefined) {
      if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({
          error: 'Amount must be a positive number',
        });
      }
    }

    // Validate date format if provided
    let donationDate: Date | undefined;
    if (date) {
      donationDate = new Date(date);
      if (isNaN(donationDate.getTime())) {
        return res.status(400).json({
          error: 'Invalid date format. Use ISO 8601 format (YYYY-MM-DD)',
        });
      }
    }

    // Check if new campaign exists (if provided)
    if (campaignId && campaignId !== existingDonation.campaignId) {
      const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId },
      });

      if (!campaign) {
        return res.status(404).json({
          error: 'Campaign not found',
        });
      }
    }

    // Build update data (only include fields that were provided)
    const updateData: any = {};
    if (amount !== undefined) updateData.amount = amount;
    if (donationDate !== undefined) updateData.date = donationDate;
    if (method !== undefined) updateData.method = method;
    if (campaignId !== undefined) updateData.campaignId = campaignId || null;
    if (recurring !== undefined) updateData.recurring = recurring;
    if (thanked !== undefined) updateData.thanked = thanked;
    if (notes !== undefined) updateData.notes = notes || null;

    const updatedDonation = await prisma.donation.update({
      where: { id: donationId },
      data: updateData,
      include: {
        donor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        campaign: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.status(200).json({
      message: 'Donation updated successfully',
      data: updatedDonation,
    });
  } catch (error) {
    console.error('Update donation error:', error);
    res.status(500).json({
      error: 'Failed to update donation',
    });
  }
});

/**
 * DELETE /api/donations/:id
 * Delete donation and revert campaign raised amount
 */
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const donationId = parseInt(id);
    if (isNaN(donationId)) {
      return res.status(400).json({
        error: 'Invalid donation ID',
      });
    }

    // Check if donation exists and get its data
    const existingDonation = await prisma.donation.findUnique({
      where: { id: donationId },
    });

    if (!existingDonation) {
      return res.status(404).json({
        error: 'Donation not found',
      });
    }

    // Delete the donation
    await prisma.donation.delete({
      where: { id: donationId },
    });

    // Revert campaign raised amount if campaign was linked
    if (existingDonation.campaignId) {
      try {
        await prisma.campaign.update({
          where: { id: existingDonation.campaignId },
          data: {
            raised: {
              decrement: existingDonation.amount,
            },
          },
        });
      } catch (error) {
        console.error('Error reverting campaign raised amount:', error);
      }
    }

    res.status(200).json({
      message: 'Donation deleted successfully',
      data: {
        deletedId: donationId,
        amount: existingDonation.amount,
        campaignReverted: existingDonation.campaignId ? true : false,
      },
    });
  } catch (error) {
    console.error('Delete donation error:', error);
    res.status(500).json({
      error: 'Failed to delete donation',
    });
  }
});

export default router;
