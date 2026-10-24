import { NotFoundError, ConflictError } from "../../common/errors.js";
import {
  MerchantRegistrationInput,
  UpdateMerchantStatusInput,
} from "./merchants.schema.js";
import {
  MerchantApplication,
  MerchantProfile,
} from "./merchants.types.js";

export class MerchantsService {
  private applications: MerchantApplication[] = [];

  /**
   * Register a new merchant application
   */
  async register(input: MerchantRegistrationInput): Promise<MerchantApplication> {
    const existing = this.applications.find(
      (app) => app.tin === input.tin && app.status !== "Rejected"
    );
    if (existing) {
      throw new ConflictError(
        `A registration application with TIN ${input.tin} already exists (Ref: ${existing.ref}).`
      );
    }

    const nextIdNumber = this.applications.length + 149;
    const ref = `APP-2026-0${nextIdNumber}`;
    const merchantId = `MER-10${nextIdNumber}`;

    const newApp: MerchantApplication = {
      id: `app-${Date.now()}`,
      ref,
      merchantId,
      fullName: input.fullName,
      phoneNumber: input.phoneNumber,
      sellerLegalName: input.sellerLegalName,
      tradeName: input.tradeName,
      tin: input.tin,
      businessLicenseNumber: input.businessLicenseNumber,
      category: input.category || "General Merchant",
      uploadedFileName: input.uploadedFileName,
      uploadedFileSize: input.uploadedFileSize,
      isDocumentReady: input.isDocumentReady ?? false,
      city: input.city,
      subCity: input.subCity,
      buildingName: input.buildingName,
      floor: input.floor,
      gpsLocation: input.gpsLocation,
      certified: input.certified,
      status: "Pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.applications.unshift(newApp);
    return newApp;
  }

  /**
   * Get all merchant applications (with optional status & search filtering)
   */
  async getAllApplications(filters?: {
    status?: string;
    category?: string;
    search?: string;
  }): Promise<MerchantApplication[]> {
    return this.applications.filter((app) => {
      if (filters?.status && filters.status !== "All Applications" && filters.status !== "All statuses") {
        if (app.status !== filters.status) return false;
      }
      if (filters?.category && filters.category !== "All business categories") {
        if (app.category !== filters.category) return false;
      }
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        const matches =
          app.sellerLegalName.toLowerCase().includes(q) ||
          app.tradeName.toLowerCase().includes(q) ||
          app.tin.includes(q) ||
          app.ref.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }

  /**
   * Find application by ref or ID
   */
  async getByRefOrId(identifier: string): Promise<MerchantApplication> {
    const app = this.applications.find(
      (a) => a.ref === identifier || a.id === identifier || a.merchantId === identifier || a.tin === identifier
    );
    if (!app) {
      throw new NotFoundError(`Merchant application '${identifier}' not found.`);
    }
    return app;
  }

  /**
   * Update application status (Officer decision)
   */
  async updateStatus(
    refOrId: string,
    update: UpdateMerchantStatusInput
  ): Promise<MerchantApplication> {
    const app = await this.getByRefOrId(refOrId);
    app.status = update.status;
    if (update.reason) {
      app.rejectionReason = update.reason;
    }
    app.updatedAt = new Date().toISOString();
    return app;
  }

  /**
   * Get merchant profile for verified merchant
   */
  async getProfile(merchantIdOrTin: string): Promise<MerchantProfile> {
    const app = await this.getByRefOrId(merchantIdOrTin);
    return {
      id: app.id,
      merchantId: app.merchantId,
      tin: app.tin,
      sellerLegalName: app.sellerLegalName,
      tradeName: app.tradeName,
      phoneNumber: app.phoneNumber,
      category: app.category,
      city: app.city,
      subCity: app.subCity,
      status: app.status,
    };
  }
}

export const merchantsService = new MerchantsService();
