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
  private applications: MerchantApplication[] = [
    {
      id: "app-1",
      ref: "APP-2026-0148",
      merchantId: "MER-10482",
      fullName: "Meklit Tesfaye",
      phoneNumber: "+251 91 123 4567",
      sellerLegalName: "Meklit Home Goods PLC",
      tradeName: "Meklit Home Goods",
      tin: "0012847391",
      businessLicenseNumber: "BL-AA-2024-9912",
      category: "Retail",
      uploadedFileName: "trade_license_2026.pdf",
      uploadedFileSize: "2.4 MB",
      isDocumentReady: true,
      city: "Addis Ababa",
      subCity: "Lideta Sub-city",
      buildingName: "Sunshine Plaza",
      floor: "2nd Floor",
      gpsLocation: "9.0123, 38.7421",
      certified: true,
      status: "Pending",
      createdAt: "2026-10-18T09:30:00Z",
      updatedAt: "2026-10-18T09:30:00Z",
    },
    {
      id: "app-2",
      ref: "APP-2026-0147",
      merchantId: "MER-10481",
      fullName: "Desta Haile",
      phoneNumber: "+251 92 345 6789",
      sellerLegalName: "Desta Pharmacy",
      tradeName: "Desta Pharmacy",
      tin: "0017932054",
      businessLicenseNumber: "BL-AD-2023-4512",
      category: "Pharmacy",
      uploadedFileName: "health_bureau_license.pdf",
      uploadedFileSize: "1.8 MB",
      isDocumentReady: true,
      city: "Adama",
      subCity: "Bole Sub-city",
      buildingName: "Red Cross Bldg",
      floor: "Ground Floor",
      gpsLocation: "8.5412, 39.2684",
      certified: true,
      status: "Under Review",
      createdAt: "2026-10-18T08:15:00Z",
      updatedAt: "2026-10-18T10:00:00Z",
    },
    {
      id: "app-3",
      ref: "APP-2026-0145",
      merchantId: "MER-10479",
      fullName: "Solomon Belay",
      phoneNumber: "+251 91 876 5432",
      sellerLegalName: "Blue Nile Stationery",
      tradeName: "Blue Nile Books & Stationery",
      tin: "0014638290",
      businessLicenseNumber: "BL-BD-2025-1109",
      category: "Wholesale",
      uploadedFileName: "tin_certificate.pdf",
      uploadedFileSize: "1.2 MB",
      isDocumentReady: true,
      city: "Bahir Dar",
      subCity: "Belay Zeleke Sub-city",
      buildingName: "Tana Commercial",
      floor: "1st Floor",
      gpsLocation: "11.5934, 37.3908",
      certified: true,
      status: "Additional Information Required",
      rejectionReason: "Please re-upload a clearer copy of your renewed municipal trade license.",
      createdAt: "2026-10-17T11:45:00Z",
      updatedAt: "2026-10-17T14:20:00Z",
    },
    {
      id: "app-4",
      ref: "APP-2026-0142",
      merchantId: "MER-10476",
      fullName: "Lomi Abera",
      phoneNumber: "+251 93 456 7890",
      sellerLegalName: "Lomi Café and Bakery",
      tradeName: "Lomi Bakery",
      tin: "0019274635",
      businessLicenseNumber: "BL-AA-2024-3312",
      category: "Hospitality",
      uploadedFileName: "trade_license_full.pdf",
      uploadedFileSize: "3.1 MB",
      isDocumentReady: true,
      city: "Addis Ababa",
      subCity: "Bole Sub-city",
      buildingName: "Medhanialem Mall",
      floor: "Ground Floor",
      gpsLocation: "8.9984, 38.7892",
      certified: true,
      status: "Approved",
      createdAt: "2026-10-16T10:00:00Z",
      updatedAt: "2026-10-16T16:00:00Z",
    },
    {
      id: "app-5",
      ref: "APP-2026-0139",
      merchantId: "MER-10473",
      fullName: "Walia Motors PLC",
      phoneNumber: "+251 91 654 3210",
      sellerLegalName: "Walia Auto Parts",
      tradeName: "Walia Spares",
      tin: "0016528347",
      businessLicenseNumber: "BL-HW-2023-7890",
      category: "Automotive",
      uploadedFileName: "walia_docs.pdf",
      uploadedFileSize: "1.9 MB",
      isDocumentReady: true,
      city: "Hawassa",
      subCity: "Tabor Sub-city",
      buildingName: "Piazza Center",
      floor: "Ground Floor",
      gpsLocation: "7.0504, 38.4763",
      certified: true,
      status: "Rejected",
      rejectionReason: "Business TIN records do not match the registered corporate entity name at Ministry of Trade.",
      createdAt: "2026-10-15T09:00:00Z",
      updatedAt: "2026-10-15T15:30:00Z",
    },
  ];

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
