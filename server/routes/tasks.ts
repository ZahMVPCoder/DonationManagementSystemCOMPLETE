import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken, AuthRequest } from '../middleware/auth.js';
import {
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskResponse,
  TaskWithDonor,
} from '../types/task.js';

const router = Router();
const prisma = new PrismaClient();

/**
 * Helper function: Get task with donor information
 */
async function getTaskWithDonor(
  taskId: string
): Promise<TaskWithDonor | null> {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      donor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!task) return null;

  return {
    id: task.id,
    type: task.type,
    description: task.description,
    donorId: task.donorId,
    donorName: task.donor.name,
    donorEmail: task.donor.email,
    dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : null,
    priority: task.priority,
    completed: task.completed,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}

/**
 * 1. GET /api/tasks
 * Get all tasks with filters for completed/pending and priority
 * Query params: completed, priority, donorId, limit, offset
 */
router.get('/', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
    const offset = parseInt(req.query.offset as string) || 0;
    const completed = req.query.completed as string;
    const priority = req.query.priority as string;
    const donorId = req.query.donorId as string;

    // Build filter
    const where: any = {};
    if (completed !== undefined) {
      where.completed = completed === 'true';
    }
    if (priority) {
      where.priority = priority;
    }
    if (donorId) {
      where.donorId = donorId;
    }

    // Get tasks with pagination
    const tasks = await prisma.task.findMany({
      where,
      include: {
        donor: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      skip: offset,
      take: limit,
      orderBy: [{ completed: 'asc' }, { dueDate: 'asc' }, { priority: 'desc' }],
    });

    // Format response
    const formattedTasks = tasks.map((task) => ({
      id: task.id,
      type: task.type,
      description: task.description,
      donorId: task.donorId,
      donorName: task.donor.name,
      dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : null,
      priority: task.priority,
      completed: task.completed,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    }));

    // Get total count
    const total = await prisma.task.count({ where });

    res.status(200).json({
      success: true,
      data: formattedTasks,
      pagination: {
        limit,
        offset,
        total,
      },
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tasks',
    });
  }
});

/**
 * 2. GET /api/tasks/:id
 * Get single task with donor information
 */
router.get('/:id', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const task = await getTaskWithDonor(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found',
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch task',
    });
  }
});

/**
 * 3. POST /api/tasks
 * Create new task
 * Body: CreateTaskRequest
 */
router.post('/', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { type, description, donorId, dueDate, priority } =
      req.body as CreateTaskRequest;

    // Validation
    if (!type || !type.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Task type is required',
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Task description is required',
      });
    }

    if (!donorId) {
      return res.status(400).json({
        success: false,
        error: 'Donor ID is required',
      });
    }

    // Check donor exists
    const donor = await prisma.donor.findUnique({
      where: { id: donorId },
    });

    if (!donor) {
      return res.status(404).json({
        success: false,
        error: 'Donor not found',
      });
    }

    // Validate date format if provided
    if (dueDate) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(dueDate)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid date format. Use YYYY-MM-DD',
        });
      }
    }

    // Validate priority
    const validPriorities = ['low', 'medium', 'high'];
    const taskPriority = priority || 'medium';
    if (!validPriorities.includes(taskPriority)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid priority. Must be low, medium, or high',
      });
    }

    // Create task
    const newTask = await prisma.task.create({
      data: {
        type: type.trim(),
        description: description.trim(),
        donorId,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority: taskPriority,
        completed: false,
      },
      include: {
        donor: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    const taskResponse: TaskWithDonor = {
      id: newTask.id,
      type: newTask.type,
      description: newTask.description,
      donorId: newTask.donorId,
      donorName: newTask.donor.name,
      donorEmail: newTask.donor.email,
      dueDate: newTask.dueDate
        ? newTask.dueDate.toISOString().split('T')[0]
        : null,
      priority: newTask.priority,
      completed: newTask.completed,
      createdAt: newTask.createdAt.toISOString(),
      updatedAt: newTask.updatedAt.toISOString(),
    };

    res.status(201).json({
      success: true,
      data: taskResponse,
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create task',
    });
  }
});

/**
 * 4. PATCH /api/tasks/:id
 * Update task (partial update)
 * Body: UpdateTaskRequest
 */
router.patch('/:id', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { type, description, dueDate, priority, completed } =
      req.body as UpdateTaskRequest;

    // Check task exists
    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found',
      });
    }

    // Validation for provided fields
    if (type !== undefined && !type.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Task type cannot be empty',
      });
    }

    if (description !== undefined && !description.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Task description cannot be empty',
      });
    }

    // Validate date format if provided
    if (dueDate) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(dueDate)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid date format. Use YYYY-MM-DD',
        });
      }
    }

    // Validate priority if provided
    if (priority) {
      const validPriorities = ['low', 'medium', 'high'];
      if (!validPriorities.includes(priority)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid priority. Must be low, medium, or high',
        });
      }
    }

    // Build update data with only provided fields
    const updateData: any = {};
    if (type !== undefined) updateData.type = type.trim();
    if (description !== undefined)
      updateData.description = description.trim();
    if (dueDate !== undefined)
      updateData.dueDate = dueDate ? new Date(dueDate) : null;
    if (priority !== undefined) updateData.priority = priority;
    if (completed !== undefined) updateData.completed = completed;

    // Update task
    const updatedTask = await prisma.task.update({
      where: { id },
      data: updateData,
    });

    // Get updated task with donor
    const taskWithDonor = await getTaskWithDonor(id);

    res.status(200).json({
      success: true,
      data: taskWithDonor,
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update task',
    });
  }
});

/**
 * 5. DELETE /api/tasks/:id
 * Delete task
 */
router.delete('/:id', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Check task exists
    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found',
      });
    }

    // Delete task
    await prisma.task.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: { id },
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete task',
    });
  }
});

export default router;
