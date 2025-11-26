import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx';
import { useWalletContext } from '@/modules/wallet/hooks/wallet-context.tsx';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button.tsx';
import { Alert, AlertDescription } from '@/components/ui/alert.tsx';
import { AlertTriangle } from 'lucide-react';

const DepositPage: React.FC = () => {
  const { authUser, isConnected } = useWalletContext();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const address = authUser?.walletAddress ?? '';

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  useEffect(() => {
    const generate = async () => {
      if (!address) {
        setQrDataUrl('');
        return;
      }
      try {
        const dataUrl = (await QRCode?.toDataURL(address, {
          errorCorrectionLevel: 'M',
          margin: 2,
          scale: 8,
        })) as string;

        setQrDataUrl(dataUrl);
      } catch {
        setQrDataUrl('');
      }
    };
    void generate();
  }, [address]);

  if (!isConnected || !address) {
    return (
      <div className="p-6">
        <Card style={{ backgroundColor: '#021e17', borderColor: '#97fce4' }}>
          <CardHeader>
            <CardTitle
              className="text-responsive-xl"
              style={{ color: '#97fce4' }}
            >
              Deposit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p style={{ color: '#97fce4', opacity: 0.8 }}>
              Connect your wallet to view your deposit QR code.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card style={{ backgroundColor: '#021e17', borderColor: '#97fce4' }}>
        <CardHeader>
          <CardTitle
            className="text-responsive-xl"
            style={{ color: '#97fce4' }}
          >
            Deposit on BNB network
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 max-w-xl">
            <div
              className="p-4 pb-8 rounded-lg"
              style={{ border: '1px solid #97fce4' }}
            >
              <p className="mb-4 font-medium" style={{ color: '#97fce4' }}>
                BNB Network
              </p>
              <div className="flex items-center justify-center">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Wallet QR Code"
                    className="rounded"
                    style={{
                      background: '#ffffff',
                      padding: 8,
                    }}
                  />
                ) : (
                  <div
                    className="w-[240px] h-[240px] rounded"
                    style={{ backgroundColor: '#0e1e27' }}
                  />
                )}
              </div>
              <Alert
                variant="destructive"
                className="border-purple-500 bg-purple-500/10 mt-3 lg:mt-6"
              >
                <AlertTriangle
                  className="h-4 w-4"
                  style={{ color: '#ef4444' }}
                />
                <AlertDescription style={{ color: '#ef4444' }}>
                  <strong>Warning:</strong> You can only send tokens on the{' '}
                  <span style={{ textDecoration: 'underline' }}>
                    BNB network{' '}
                  </span>
                  . If you send coins to addresses on other networks, you may
                  lose your tokens permanently. We do not have an agreement to
                  return tokens sent to incorrect networks.
                </AlertDescription>
              </Alert>
            </div>

            <div>
              <p className="mb-2 font-medium" style={{ color: '#97fce4' }}>
                Wallet Address
              </p>
              <Button
                onClick={() => copyToClipboard(address)}
                variant="link"
                className="w-full p-4 rounded-lg text-sm break-all"
                style={{ border: '1px solid #97fce4', color: '#97fce4' }}
              >
                {address}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DepositPage;
