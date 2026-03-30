import { DeliveryStep } from './DeliveryStep';
import { PaymentStep } from './PaymentStep';
import { ReviewStep } from './ReviewStep';
import { CheckoutFlowState } from '../useCheckoutFlow';

interface CheckoutStepRendererProps {
  checkout: CheckoutFlowState;
}

export const CheckoutStepRenderer = ({ checkout }: CheckoutStepRendererProps) => {
  const stepRenderers = {
    1: () => (
      <DeliveryStep
        deliveryMethod={checkout.deliveryMethod}
        deliveryType={checkout.deliveryType}
        selectedBranch={checkout.selectedBranchId}
        selectedInstantService={checkout.selectedInstantService}
        selectedStandardService={checkout.selectedStandardService}
        address={checkout.address}
        branches={checkout.branches}
        instantServices={checkout.instantServices}
        standardServices={checkout.standardServices}
        onDeliveryMethodChange={checkout.setDeliveryMethod}
        onDeliveryTypeChange={checkout.setDeliveryType}
        onSelectedBranchChange={checkout.setSelectedBranchId}
        onSelectedInstantServiceChange={checkout.setSelectedInstantService}
        onSelectedStandardServiceChange={checkout.setSelectedStandardService}
        onAddressChange={checkout.updateAddress}
        onContinue={checkout.goToNextStep}
      />
    ),
    2: () => (
      <PaymentStep
        paymentMethod={checkout.paymentMethod}
        onPaymentMethodChange={checkout.setPaymentMethod}
        onBack={() => checkout.goToStep(1)}
        onContinue={checkout.goToNextStep}
      />
    ),
    3: () => (
      <ReviewStep
        deliveryMethod={checkout.deliveryMethod}
        deliveryType={checkout.deliveryType}
        address={checkout.address}
        selectedBranch={checkout.selectedBranch}
        selectedShippingService={checkout.selectedShippingService}
        paymentMethod={checkout.paymentMethod}
        orderNote={checkout.orderNote}
        total={checkout.total}
        isProcessing={checkout.isProcessing}
        onOrderNoteChange={checkout.setOrderNote}
        onBack={() => checkout.goToStep(2)}
        onConfirm={checkout.placeOrder}
      />
    ),
  } as const;

  return stepRenderers[checkout.checkoutStep]();
};
