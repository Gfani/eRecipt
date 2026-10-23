import { Router } from 'express';
import { registrationController } from './registration.controller.js';
import { licenseUpload } from './upload.middleware.js';

export const registrationRouter = Router();

// 1. Submit complete 5-step registration (accepts JSON or multipart file attachment)
registrationRouter.post(
  '/submit',
  licenseUpload.single('document'),
  (req, res) => registrationController.submitApplication(req, res)
);

// 2. Upload standalone business license / trade permit (Step 3)
registrationRouter.post(
  '/upload-license',
  licenseUpload.single('document'),
  (req, res) => registrationController.uploadLicense(req, res)
);

// 3. Pre-validate Ethiopian 10-digit TIN & check uniqueness (Step 2)
registrationRouter.get(
  '/check-tin/:tin',
  (req, res) => registrationController.checkTin(req, res)
);

// 4. Live status lookup for WorkflowPipelineStepper post-submission
registrationRouter.get(
  '/status/:referenceNumber',
  (req, res) => registrationController.getStatus(req, res)
);

// 5. Get all applications (for Revenue Admin portal review)
registrationRouter.get(
  '/applications',
  (req, res) => registrationController.getAllApplications(req, res)
);
