import { BRANCHES, INSTANT_SERVICES, STANDARD_SERVICES } from './constants';
import { DeliveryMethod, DeliveryType } from './types';

export const getSelectedShippingService = (
  deliveryType: DeliveryType,
  selectedInstantService: string,
  selectedStandardService: string
) => {
  if (deliveryType === 'instant') {
    return INSTANT_SERVICES.find((service) => service.id === selectedInstantService);
  }

  return STANDARD_SERVICES.find((service) => service.id === selectedStandardService);
};

export const getShippingFee = (
  deliveryMethod: DeliveryMethod,
  deliveryType: DeliveryType,
  selectedInstantService: string,
  selectedStandardService: string
) => {
  if (deliveryMethod === 'pickup') {
    return 0;
  }

  return getSelectedShippingService(deliveryType, selectedInstantService, selectedStandardService)?.price || 0;
};

export const getShippingCarrier = (
  deliveryMethod: DeliveryMethod,
  deliveryType: DeliveryType,
  selectedInstantService: string,
  selectedStandardService: string
) => {
  if (deliveryMethod === 'pickup') {
    return 'Pickup at branch';
  }

  return getSelectedShippingService(deliveryType, selectedInstantService, selectedStandardService)?.name || 'Standard';
};

export const getSelectedBranch = (selectedBranchId: number) => {
  return BRANCHES.find((branch) => branch.id === selectedBranchId);
};
