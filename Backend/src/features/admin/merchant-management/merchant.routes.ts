import { Router, type NextFunction, type Request, type Response } from 'express';
import { merchantManagementController } from './merchant.controller.js';
import { officerAuthService } from '../officer-auth/index.js';
import { UnauthorizedError } from '../../../common/errors.js';

export const merchantManagementRouter = Router();

merchantManagementRouter.use(async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const officer = await officerAuthService.getOfficerFromToken(req.headers.authorization || '');
    if (!officer) {
      throw new UnauthorizedError('A valid revenue officer session is required.');
    }

    req.user = {
      id: officer.id,
      role: officer.role === 'ADMIN' ? 'admin' : 'officer',
      identifier: officer.username,
      name: officer.name,
    };
    next();
  } catch (error) {
    next(error);
  }
});

// Onboarding Applications Review
merchantManagementRouter.get('/applications', (req, res) =>
  merchantManagementController.getApplications(req, res)
);
merchantManagementRouter.get('/applications/:ref', (req, res) =>
  merchantManagementController.getApplication(req, res)
);
merchantManagementRouter.get('/applications/:ref/document', (req, res) =>
  merchantManagementController.downloadDocument(req, res)
);
merchantManagementRouter.post('/applications/:ref/decision', (req, res) =>
  merchantManagementController.submitDecision(req, res)
);

// Central Taxpayers Directory
merchantManagementRouter.get('/directory', (req, res) =>
  merchantManagementController.getDirectory(req, res)
);
merchantManagementRouter.get('/directory/:id', (req, res) =>
  merchantManagementController.getDirectoryMerchant(req, res)
);
merchantManagementRouter.patch('/directory/:id/status', (req, res) =>
  merchantManagementController.updateStatus(req, res)
);
