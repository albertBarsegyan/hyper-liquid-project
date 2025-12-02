import { SignupSuccessModal } from './signup-success-modal.tsx';
import { TotpSetupModal } from './totp-setup-modal.tsx';
import { TotpCodeModal } from './totp-code-modal.tsx';
import { useModal } from '@/modules/shared/contexts/modal-context.tsx';

export const ModalRenderer = () => {
  const { isOpen, modalType, hideModal, modalData } = useModal();

  if (!isOpen || !modalType) return null;

  const handleClose = () => {
    // Call custom onClose if provided, then hide modal
    if (modalData.onClose && typeof modalData.onClose === 'function') {
      modalData.onClose();
    }
    hideModal();
  };

  switch (modalType) {
    case 'signup-success':
      return (
        <SignupSuccessModal
          isOpen={isOpen}
          onClose={hideModal}
          amount={modalData.amount as string | undefined}
        />
      );
    case 'totp-setup':
      return (
        <TotpSetupModal
          isOpen={isOpen}
          onClose={handleClose}
          onVerify={modalData.onVerify as (code: string) => Promise<boolean>}
          qrCode={modalData.qrCode as string}
          manualEntryKey={modalData.manualEntryKey as string}
        />
      );
    case 'totp-code':
      return (
        <TotpCodeModal
          isOpen={isOpen}
          onClose={handleClose}
          onSubmit={
            modalData.onSubmit as (
              code: string
            ) => Promise<{ success?: boolean; error?: string }>
          }
          tagName={modalData.tagName as string}
        />
      );
    default:
      return null;
  }
};
