import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WalletConnectButton } from '@/modules/wallet';
import { Wallet, Shield, Zap, ArrowRight } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Wallet className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">CryptoApp</span>
            </div>
            <WalletConnectButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            🚀 Powered by HyperEVM
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Connect to
            <span className="text-primary"> HyperEVM</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience seamless wallet integration with HyperEVM network.
            Connect your MetaMask wallet and automatically switch to HyperEVM.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose Our Platform?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Built with modern web3 technologies and user experience in mind
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <Wallet className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Auto HyperEVM Connection</CardTitle>
              <CardDescription>
                Connect your MetaMask wallet and automatically switch to
                HyperEVM network. No manual network switching required.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Secure & Reliable</CardTitle>
              <CardDescription>
                Your wallet connection is secure and your private keys never
                leave your device.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>HyperEVM Network</CardTitle>
              <CardDescription>
                Built for HyperEVM network with fast transactions and low fees.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="text-center py-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg mb-8 opacity-90">
              Connect your wallet and start exploring the decentralized world
            </p>
            <WalletConnectButton />
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>
              &copy; 2024 CryptoApp. Built with ❤️ for the decentralized future.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
