import { SignupSuccessModal } from './signup-success-modal.tsx';
import { useModal } from '@/modules/shared/contexts/modal-context.tsx';

export const ModalRenderer = () => {
  const { isOpen, modalType, hideModal, modalData } = useModal();

  if (!isOpen || !modalType) return null;

  switch (modalType) {
    case 'signup-success':
      return (
        <SignupSuccessModal
          isOpen={isOpen}
          onClose={hideModal}
          amount={modalData.amount as string | undefined}
        />
      );
    default:
      return null;
  }
};
