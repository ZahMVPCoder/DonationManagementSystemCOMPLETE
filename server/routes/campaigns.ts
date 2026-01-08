import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken, AuthRequest } from '../middleware/auth.js';
import {
  CreateCampaignRequest,
  UpdateCampaignRequest,
  CampaignResponse,
  CampaignWithDonations,
} from '../types/campaign.js';

const router = Router();
const prisma = new PrismaClient();

/**
 * Helper function: Calculate raised amount dynamically
 * Sums all donations linked to the campaign
 */
async function calculateRaisedAmount(campaignId: string): Promise<number> {
  const result = await prisma.donation.aggregate({
    where: { campaignId },
    _sum: { amount: true },
  });
  return result._sum.amount || 0;
}

/**
 * Helper function: Get campaign with donations and calculated raised amount
 */
async function getCampaignWithDetails(
  campaignId: string
): Promise<CampaignWithDonations | null> {
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: {
      donations: {
        select: {
          id: true,
          amount: true,
          date: true,
          method: true,
          donorId: true,
          thanked: true,
        },
        orderBy: { date: 'desc' },
      },
    },
  });

  if (!campaign) return null;

  // Calculate raised amount from donations
  const raised = campaign.donations.reduce(
    (sum: number, donation: any) => sum + donation.amount,
    0
  );

  return {
    id: campaign.id,
    name: campaign.name,
    description: campaign.description,
    goal: campaign.goal,
    raised,
    startDate: campaign.startDate.toISOString().split('T')[0],
    endDate: campaign.endDate ? campaign.endDate.toISOString().split('T')[0] : null,
    status: campaign.status,
    donationCount: campaign.donations.length,
    donations: campaign.donations.map((d: any) => ({
      id: d.id,
      amount: d.amount,
      date: d.date.toISOString().split('T')[0],
      method: d.method,
      donorId: d.donorId,
      thanked: d.thanked,
    })),
    createdAt: campaign.createdAt.toISOString(),
    updatedAt: campaign.updatedAt.toISOString(),
  };
}

/**
 * 1. GET /api/campaigns
 * Get all campaigns with list of donations and calculated raised amount
 * Query params: limit (max 100), offset (default 0), status filter
 */
router.get('/', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
    const offset = parseInt(req.query.offset as string) || 0;
    const status = req.query.status as string;

    // Build filter
    const where: any = {};
    if (status) {
      where.status = status;
    }

    // Get campaigns with pagination
    const campaigns = await prisma.campaign.findMany({
      where,
      include: {
        donations: {
          select: {
            amount: true,
          },
        },
      },
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    // Calculate raised for each campaign
    const campaignsWithRaised = campaigns.map((campaign: any) => {
      const raised = campaign.donations.reduce(
        (sum: number, donation: any) => sum + donation.amount,
        0
      );

      return {
        id: campaign.id,
        name: campaign.name,
        description: campaign.description,
        goal: campaign.goal,
        raised,
        startDate: campaign.startDate.toISOString().split('T')[0],
        endDate: campaign.endDate
          ? campaign.endDate.toISOString().split('T')[0]
          : null,
        status: campaign.status,
        donationCount: campaign.donations.length,
        createdAt: campaign.createdAt.toISOString(),
        updatedAt: campaign.updatedAt.toISOString(),
      };
    });

    // Get total count
    const total = await prisma.campaign.count({ where });

    res.status(200).json({
      success: true,
      data: campaignsWithRaised,
      pagination: {
        limit,
        offset,
        total,
      },
    });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch campaigns',
    });
  }
});

/**
 * 2. GET /api/campaigns/:id
 * Get single campaign with all linked donations and calculated raised amount
 */
router.get('/:id', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const campaign = await getCampaignWithDetails(id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: 'Campaign not found',
      });
    }

    res.status(200).json({
      success: true,
      data: campaign,
    });
  } catch (error) {
    console.error('Error fetching campaign:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch campaign',
    });
  }
});

/**
 * 3. POST /api/campaigns
 * Create new campaign
 * Body: CreateCampaignRequest
 */
router.post('/', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, goal, startDate, endDate, status } =
      req.body as CreateCampaignRequest;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Campaign name is required',
      });
    }

    if (!goal || goal <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Goal must be a positive number',
      });
    }

    if (!startDate) {
      return res.status(400).json({
        success: false,
        error: 'Start date is required (format: YYYY-MM-DD)',
      });
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(startDate)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date format. Use YYYY-MM-DD',
      });
    }

    if (endDate && !dateRegex.test(endDate)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid end date format. Use YYYY-MM-DD',
      });
    }

    // Validate status
    const validStatuses = ['active', 'completed', 'paused'];
    const campaignStatus = status || 'active';
    if (!validStatuses.includes(campaignStatus)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be active, completed, or paused',
      });
    }

    // Create campaign
    const newCampaign = await prisma.campaign.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        goal,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        status: campaignStatus,
      },
    });

    const campaignResponse: CampaignResponse = {
      id: newCampaign.id,
      name: newCampaign.name,
      description: newCampaign.description,
      goal: newCampaign.goal,
      raised: 0, // New campaign has no donations
      startDate: newCampaign.startDate.toISOString().split('T')[0],
      endDate: newCampaign.endDate
        ? newCampaign.endDate.toISOString().split('T')[0]
        : null,
      status: newCampaign.status,
      donationCount: 0,
      createdAt: newCampaign.createdAt.toISOString(),
      updatedAt: newCampaign.updatedAt.toISOString(),
    };

    res.status(201).json({
      success: true,
      data: campaignResponse,
    });
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create campaign',
    });
  }
});

/**
 * 4. PATCH /api/campaigns/:id
 * Update campaign (partial update)
 * Body: UpdateCampaignRequest
 */
router.patch('/:id', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, goal, startDate, endDate, status } =
      req.body as UpdateCampaignRequest;

    // Check campaign exists
    const campaign = await prisma.campaign.findUnique({
      where: { id },
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: 'Campaign not found',
      });
    }

    // Validation for provided fields
    if (name !== undefined && !name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Campaign name cannot be empty',
      });
    }

    if (goal !== undefined && goal <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Goal must be a positive number',
      });
    }

    // Validate date formats if provided
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (startDate && !dateRegex.test(startDate)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid start date format. Use YYYY-MM-DD',
      });
    }

    if (endDate && !dateRegex.test(endDate)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid end date format. Use YYYY-MM-DD',
      });
    }

    // Validate status if provided
    if (status) {
      const validStatuses = ['active', 'completed', 'paused'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid status. Must be active, completed, or paused',
        });
      }
    }

    // Build update data with only provided fields
    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (goal !== undefined) updateData.goal = goal;
    if (startDate !== undefined) updateData.startDate = new Date(startDate);
    if (endDate !== undefined)
      updateData.endDate = endDate ? new Date(endDate) : null;
    if (status !== undefined) updateData.status = status;

    // Update campaign
    const updatedCampaign = await prisma.campaign.update({
      where: { id },
      data: updateData,
    });

    // Get updated campaign with details
    const campaignWithDetails = await getCampaignWithDetails(id);

    res.status(200).json({
      success: true,
      data: campaignWithDetails,
    });
  } catch (error) {
    console.error('Error updating campaign:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update campaign',
    });
  }
});

export default router;
