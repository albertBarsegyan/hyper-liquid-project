import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { ModalRenderer } from '@/components/modals/modal-renderer.tsx';

export type ModalType = 'signup-success' | 'custom';

interface ShowModalParams {
  type: ModalType;
  data?: Record<string, unknown>;
}

interface ModalContextValue {
  showModal: (params: ShowModalParams) => void;
  hideModal: () => void;
  isOpen: boolean;
  modalType: ModalType | null;
  modalData: Record<string, unknown>;
}

interface ModalState {
  isOpen: boolean;
  type: ModalType | null;
  data: Record<string, unknown>;
}

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

export const ModalProvider = ({ children }: PropsWithChildren) => {
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    type: null,
    data: {},
  });

  const hideModal = useCallback(() => {
    setModal({
      isOpen: false,
      type: null,
      data: {},
    });
  }, []);

  const showModal = useCallback(({ type, data = {} }: ShowModalParams) => {
    setModal({
      isOpen: true,
      type,
      data,
    });
  }, []);

  const value = useMemo<ModalContextValue>(
    () => ({
      showModal,
      hideModal,
      isOpen: modal.isOpen,
      modalType: modal.type,
      modalData: modal.data,
    }),
    [hideModal, showModal, modal.isOpen, modal.type, modal.data]
  );

  return (
    <ModalContext.Provider value={value}>
      {children}
      <ModalRenderer />
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextValue => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }

  return context;
};
