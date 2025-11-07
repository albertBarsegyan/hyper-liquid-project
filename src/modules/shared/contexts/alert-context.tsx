import {
  createContext,
  type JSX,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert.tsx';
import { Button } from '@/components/ui/button.tsx';
import { cn } from '@/lib/utils.ts';

export type AlertVariant = 'success' | 'error' | 'info';

interface ShowAlertParams {
  message: string;
  variant?: AlertVariant;
  timeout?: number;
}

interface AlertContextValue {
  showAlert: (params: ShowAlertParams) => void;
  hideAlert: () => void;
}

interface AlertState {
  isOpen: boolean;
  message: string;
  variant: AlertVariant;
  timeout: number;
}

const AlertContext = createContext<AlertContextValue | undefined>(undefined);

const DEFAULT_ALERT_TIMEOUT = 5000;

const alertIcons: Record<AlertVariant, JSX.Element> = {
  success: <CheckCircle2 className="h-5 w-5" />,
  error: <AlertCircle className="h-5 w-5" />,
  info: <Info className="h-5 w-5" />,
};

const alertStyles: Record<AlertVariant, string> = {
  success: 'border-green-500 bg-green-500/10 text-green-200',
  error: 'border-red-500 bg-red-500/10 text-red-200',
  info: 'border-blue-500 bg-blue-500/10 text-blue-200',
};

const AlertRenderer = ({
  alert,
  onClose,
}: {
  alert: AlertState;
  onClose: () => void;
}) => {
  if (!alert.isOpen) return null;

  return (
    <div className="pointer-events-none fixed top-4 lg:right-8 z-[9999] flex justify-center px-4 sm:px-0">
      <Alert
        role="status"
        className={cn(
          'pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-xl shadow-lg backdrop-blur-lg transition-all duration-300 sm:mx-auto',
          alertStyles[alert.variant]
        )}
      >
        <span aria-hidden className="mt-0.5">
          {alertIcons[alert.variant]}
        </span>
        <AlertDescription className="flex-1 text-sm sm:text-base">
          {alert.message}
        </AlertDescription>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Dismiss alert"
          className="-mr-2 h-8 w-8 text-inherit"
          onClick={onClose}
        >
          <span aria-hidden>&times;</span>
        </Button>
      </Alert>
    </div>
  );
};

export const AlertProvider = ({ children }: PropsWithChildren) => {
  const [alert, setAlert] = useState<AlertState>({
    isOpen: false,
    message: '',
    variant: 'info',
    timeout: DEFAULT_ALERT_TIMEOUT,
  });

  const hideAlert = useCallback(() => {
    setAlert(prev => ({ ...prev, isOpen: false }));
  }, []);

  const showAlert = useCallback(
    ({
      message,
      variant = 'info',
      timeout = DEFAULT_ALERT_TIMEOUT,
    }: ShowAlertParams) => {
      setAlert({
        isOpen: true,
        message,
        variant,
        timeout,
      });
    },
    []
  );

  useEffect(() => {
    if (!alert.isOpen) return;

    const timer = window.setTimeout(() => {
      hideAlert();
    }, alert.timeout);

    return () => window.clearTimeout(timer);
  }, [alert.isOpen, alert.timeout, hideAlert]);

  const value = useMemo<AlertContextValue>(
    () => ({
      showAlert,
      hideAlert,
    }),
    [hideAlert, showAlert]
  );

  return (
    <AlertContext.Provider value={value}>
      {children}
      <AlertRenderer alert={alert} onClose={hideAlert} />
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextValue => {
  const context = useContext(AlertContext);

  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }

  return context;
};
