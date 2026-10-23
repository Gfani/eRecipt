import crypto from 'node:crypto';
import { applicationStorage } from './storage.js';
import type {
  MerchantRegistrationInput,
  StoredMerchantApplication,
  TinCheckResult,
  RegistrationSubmissionResult,
  RegistrationStatusResult,
} from './types.js';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password.trim()).digest('hex');
}

function generateReferenceNumber(): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `APP-${year}-${randomSuffix}`;
}

export class MerchantRegistrationService {
  /**
   * Validates Ethiopian 10-digit Taxpayer Identification Number format and checks uniqueness
   */
  public checkTin(tinRaw: string): TinCheckResult {
    const tin = (tinRaw || '').trim();

    // Ethiopian TIN is strictly 10 digits
    const isValidFormat = /^\d{10}$/.test(tin);

    if (!isValidFormat) {
      return {
        tin,
        validFormat: false,
        isAvailable: false,
        message: 'Invalid TIN format. Ethiopian TIN must be exactly 10 numeric digits.',
      };
    }

    const existing = applicationStorage.getByTin(tin);
    if (existing) {
      return {
        tin,
        validFormat: true,
        isAvailable: false,
        message: `TIN ${tin} is already associated with application ${existing.referenceNumber} (${existing.sellerLegalName}).`,
      };
    }

    return {
      tin,
      validFormat: true,
      isAvailable: true,
      message: 'TIN is valid and eligible for new registration.',
    };
  }

  /**
   * Submits the complete 5-step merchant registration application
   */
  public submitRegistration(
    input: MerchantRegistrationInput,
    uploadedFile?: Express.Multer.File
  ): RegistrationSubmissionResult {
    // 1. Mandatory field validations
    if (!input.fullName?.trim() || !input.phoneNumber?.trim() || !input.password?.trim()) {
      throw new Error('Step 1 missing: Full name, phone number, and password are required.');
    }

    if (
      !input.sellerLegalName?.trim() ||
      !input.tradeName?.trim() ||
      !input.tin?.trim() ||
      !input.businessLicenseNumber?.trim()
    ) {
      throw new Error('Step 2 missing: Legal name, trade name, 10-digit TIN, and license number are required.');
    }

    const tinCheck = this.checkTin(input.tin);
    if (!tinCheck.validFormat) {
      throw new Error(tinCheck.message);
    }
    if (!tinCheck.isAvailable) {
      throw new Error(tinCheck.message);
    }

    if (!input.city?.trim() || !input.subCity?.trim() || !input.buildingName?.trim()) {
      throw new Error('Step 4 missing: City, sub-city, and building address are required.');
    }

    if (!input.certified) {
      throw new Error('Step 5 missing: You must certify the accuracy of your business tax registration details.');
    }

    // 2. Prepare record
    const ref = generateReferenceNumber();
    const now = new Date();
    const submissionFormatted = now.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const newApplication: StoredMerchantApplication = {
      id: `app-${Date.now()}`,
      referenceNumber: ref,
      submissionDate: submissionFormatted,
      status: 'Pending',
      fullName: input.fullName.trim(),
      phoneNumber: input.phoneNumber.trim(),
      email: input.email ? input.email.trim() : undefined,
      emailVerified: Boolean(input.emailVerified),
      passwordHash: hashPassword(input.password),
      sellerLegalName: input.sellerLegalName.trim(),
      tradeName: input.tradeName.trim(),
      tin: input.tin.trim(),
      businessLicenseNumber: input.businessLicenseNumber.trim(),
      uploadedFileName: uploadedFile ? uploadedFile.originalname : input.uploadedFileName,
      uploadedFileSize: uploadedFile
        ? `${(uploadedFile.size / (1024 * 1024)).toFixed(1)} MB`
        : input.uploadedFileSize,
      documentPath: uploadedFile ? uploadedFile.path : undefined,
      city: input.city.trim(),
      subCity: input.subCity.trim(),
      buildingName: input.buildingName.trim(),
      floor: (input.floor || '').trim(),
      gpsLocation: (input.gpsLocation || '').trim(),
      certified: input.certified,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    applicationStorage.create(newApplication);

    return {
      success: true,
      referenceNumber: ref,
      status: 'Pending',
      submissionDate: submissionFormatted,
      sellerLegalName: newApplication.sellerLegalName,
      tradeName: newApplication.tradeName,
      tin: newApplication.tin,
      message: 'Merchant registration application submitted successfully. Pending Revenue Officer compliance review.',
    };
  }

  /**
   * Retrieves live status of a submitted application for WorkflowPipelineStepper
   */
  public getStatus(referenceNumberRaw: string): RegistrationStatusResult {
    const ref = (referenceNumberRaw || '').trim();
    const app = applicationStorage.getByReference(ref);

    if (!app) {
      throw new Error(`Registration application with reference '${ref}' was not found.`);
    }

    let stage = 1; // 1 = Submitted
    if (app.status === 'Under Review' || app.status === 'Additional Information Required') {
      stage = 2;
    } else if (app.status === 'Approved' || app.status === 'Rejected') {
      stage = 3;
    }

    return {
      referenceNumber: app.referenceNumber,
      sellerLegalName: app.sellerLegalName,
      tradeName: app.tradeName,
      tin: app.tin,
      status: app.status,
      submissionDate: app.submissionDate,
      reviewNotes: app.reviewNotes,
      stage,
    };
  }

  /**
   * Retrieves all submitted applications (for admin review list)
   */
  public getAllApplications(): StoredMerchantApplication[] {
    return applicationStorage.getAll();
  }
}

export const registrationService = new MerchantRegistrationService();
