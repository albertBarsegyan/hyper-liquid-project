import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send, ArrowUpRight } from 'lucide-react';

const SendPage: React.FC = () => {
  return (
    <div className="container-responsive py-responsive min-h-full">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-responsive-3xl font-bold mb-2" style={{ color: '#97fce4' }}>
            Send
          </h1>
          <p className="text-responsive-base" style={{ color: '#97fce4', opacity: 0.8 }}>
            Send tokens to any address on the HyperEVM network
          </p>
        </div>

        <Card style={{ backgroundColor: '#021e17', borderColor: '#97fce4' }}>
          <CardHeader>
            <CardTitle
              className="flex items-center text-responsive-lg"
              style={{ color: '#97fce4' }}
            >
              <Send className="mr-2 h-5 w-5" />
              Send Transaction
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label
                className="block text-responsive-sm font-medium mb-2"
                style={{ color: '#97fce4' }}
              >
                Recipient Address
              </label>
              <input
                type="text"
                placeholder="0x..."
                className="w-full p-3 border rounded-lg text-responsive-sm"
                style={{
                  backgroundColor: '#0e1e27',
                  borderColor: '#97fce4',
                  color: '#97fce4',
                }}
              />
            </div>

            <div>
              <label
                className="block text-responsive-sm font-medium mb-2"
                style={{ color: '#97fce4' }}
              >
                Amount
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="number"
                  placeholder="0.0"
                  className="flex-1 p-3 border rounded-lg text-responsive-sm"
                  style={{
                    backgroundColor: '#0e1e27',
                    borderColor: '#97fce4',
                    color: '#97fce4',
                  }}
                />
                <Button
                  variant="outline"
                  className="sm:w-auto w-full"
                  style={{
                    borderColor: '#97fce4',
                    color: '#97fce4',
                    backgroundColor: 'transparent',
                    height: '50px',
                  }}
                >
                  HYPE
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <Button
                className="w-full sm:w-auto"
                style={{
                  backgroundColor: '#97fce4',
                  color: '#0e1e27',
                  border: 'none',
                }}
              >
                <ArrowUpRight className="mr-2 h-4 w-4" />
                Send Transaction
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SendPage;
