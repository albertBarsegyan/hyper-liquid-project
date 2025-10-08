import React from 'react';
import {
  ExternalLink,
  Code,
  Wallet,
  Trophy,
  Activity,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { innerRoutePath } from '@/modules/shared/utils/route.ts';
import { useWalletContext } from '@/modules/wallet';

interface DocSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
  subsections?: DocSection[];
}

const DocsPage: React.FC = () => {
  const { isAuthenticated } = useWalletContext();

  const sections: DocSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Code,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Welcome to HyperEVM
            </h3>
            <p className="text-gray-300 leading-relaxed">
              HyperEVM is a decentralized platform for Real World Assets (RWA)
              liquidity on the HyperLiquid network. Connect your wallet and
              start earning rewards through our Genesis Campaign.
            </p>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <h4 className="text-lg font-medium text-white mb-3">Quick Start</h4>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>Connect your wallet using the wallet connect button</li>
              <li>Complete the registration process</li>
              <li>Start earning rewards through deposits and referrals</li>
              <li>Track your activity and earnings in the dashboard</li>
            </ol>
          </div>

          <div>
            <h4 className="text-lg font-medium text-white mb-3">
              Supported Wallets
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
                <h5 className="font-medium text-white mb-2">MetaMask</h5>
                <p className="text-sm text-gray-400">
                  Most popular Ethereum wallet
                </p>
              </div>
              <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
                <h5 className="font-medium text-white mb-2">WalletConnect</h5>
                <p className="text-sm text-gray-400">
                  Connect any compatible wallet (Coming soon)
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'wallet-integration',
      title: 'Wallet Integration',
      icon: Wallet,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Connecting Your Wallet
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Our platform supports secure wallet integration through MetaMask
              and WalletConnect protocols.
            </p>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <h4 className="text-lg font-medium text-white mb-3">
              Authentication Flow
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="text-white font-medium">Request Nonce</p>
                  <p className="text-gray-400 text-sm">
                    Server generates a unique nonce for your wallet address
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="text-white font-medium">Sign Message</p>
                  <p className="text-gray-400 text-sm">
                    Your wallet signs the nonce to prove ownership
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">
                  3
                </div>
                <div>
                  <p className="text-white font-medium">Get Access Token</p>
                  <p className="text-gray-400 text-sm">
                    Server verifies signature and issues access token
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium text-white mb-3">
              Security Features
            </h4>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                Non-custodial wallet integration
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                No private key storage
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                Secure signature verification
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                Session-based authentication
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'referral-system',
      title: 'Referral System',
      icon: Users,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Earn Through Referrals
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Our referral system allows you to earn rewards when you invite
              friends to join the platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h4 className="text-lg font-medium text-white mb-3">
                For Referrers
              </h4>
              <ul className="space-y-2 text-gray-300">
                <li>• Earn points for each successful referral</li>
                <li>• Track referral performance</li>
                <li>• Get bonus rewards for milestones</li>
                <li>• Share your unique referral code</li>
              </ul>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h4 className="text-lg font-medium text-white mb-3">
                For Referees
              </h4>
              <ul className="space-y-2 text-gray-300">
                <li>• Get bonus rewards on first deposit</li>
                <li>• Access to exclusive features</li>
                <li>• Priority customer support</li>
                <li>• Special Genesis Campaign benefits</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <h4 className="text-lg font-medium text-white mb-3">
              Referral Rewards
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 text-white">Action</th>
                    <th className="text-left py-2 text-white">
                      Points Awarded
                    </th>
                    <th className="text-left py-2 text-white">Description</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-b border-gray-700/50">
                    <td className="py-2">Deposit Points</td>
                    <td className="py-2">Based on USD amount</td>
                    <td className="py-2">Awarded when you make deposits</td>
                  </tr>
                  <tr className="border-b border-gray-700/50">
                    <td className="py-2">Balance Milestone</td>
                    <td className="py-2">Bonus rewards</td>
                    <td className="py-2">
                      Awarded for reaching balance milestones
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2">Referral Bonus</td>
                    <td className="py-2">Per successful referral</td>
                    <td className="py-2">
                      Awarded when referrals complete actions
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'rewards-program',
      title: 'Rewards Program',
      icon: Trophy,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Genesis Campaign
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Join our Genesis Campaign to earn exclusive rewards and be part of
              the platform's early community.
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-lg p-6 border border-green-500/30">
            <h4 className="text-lg font-medium text-white mb-3">
              Campaign Benefits
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-2">
                  <Trophy className="w-6 h-6 text-green-400" />
                </div>
                <h5 className="font-medium text-white mb-1">Early Access</h5>
                <p className="text-sm text-gray-400">
                  Exclusive features and rewards
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <h5 className="font-medium text-white mb-1">Community</h5>
                <p className="text-sm text-gray-400">
                  Join our growing community
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-2">
                  <Activity className="w-6 h-6 text-purple-400" />
                </div>
                <h5 className="font-medium text-white mb-1">Rewards</h5>
                <p className="text-sm text-gray-400">Earn points and bonuses</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium text-white mb-3">
              How to Participate
            </h4>
            <ol className="list-decimal list-inside space-y-3 text-gray-300">
              <li>Connect your wallet and complete registration</li>
              <li>Make your first deposit to activate rewards</li>
              <li>Share your referral code with friends</li>
              <li>Track your progress in the dashboard</li>
              <li>Claim rewards as they become available</li>
            </ol>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0e1e27' }}>
      {/* Header */}
      <div className="border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Documentation
              </h1>
              <p className="text-gray-400">
                Complete guide to using DLIQD platform
              </p>
            </div>
            {!isAuthenticated && (
              <Link
                to={innerRoutePath.getMain()}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                Get Started
                <ExternalLink className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
              {sections.map(section => (
                <div
                  key={section.id}
                  className="bg-gray-800/30 rounded-xl p-8 border border-gray-700"
                >
                  {section.content}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-700 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-gray-400 mb-4">
              Powered by{' '}
              <span className="text-green-400 font-medium">HyperLiquid</span>
            </p>
            <p className="text-sm text-gray-500">
              Need help? Contact our support team or join our community.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocsPage;
