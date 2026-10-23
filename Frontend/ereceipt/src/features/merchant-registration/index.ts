export { MerchantRegistration } from './MerchantRegistration';
export { default } from './MerchantRegistration';
export * from './types';
export { Step1AccountDetails } from './components/steps/Step1AccountDetails';
export { Step2TaxIdentity } from './components/steps/Step2TaxIdentity';
export { Step3Licenses } from './components/steps/Step3Licenses';
export { Step4BusinessLocation } from './components/steps/Step4BusinessLocation';
export { Step5Review } from './components/steps/Step5Review';
export {
  getStoredMerchantProfile,
  saveStoredMerchantProfile,
  clearStoredMerchantProfile,
  DEFAULT_MERCHANT_PROFILE,
} from './profileStorage';
