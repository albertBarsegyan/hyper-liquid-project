import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Globe,
  Search,
  ExternalLink,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';

const ExplorePage: React.FC = () => {
  const exploreItems = [
    {
      title: 'Top Tokens',
      description: 'Discover trending tokens on HyperEVM',
      icon: TrendingUp,
      color: '#97fce4',
    },
    {
      title: 'DeFi Protocols',
      description: 'Explore decentralized finance protocols',
      icon: Globe,
      color: '#97fce4',
    },
    {
      title: 'NFT Collections',
      description: 'Browse NFT collections and marketplaces',
      icon: Users,
      color: '#97fce4',
    },
    {
      title: 'DApps',
      description: 'Find decentralized applications',
      icon: Zap,
      color: '#97fce4',
    },
  ];

  return (
    <div className="container-responsive py-responsive min-h-full">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-responsive-3xl font-bold mb-2" style={{ color: '#97fce4' }}>
            Explore
          </h1>
          <p className="text-responsive-base" style={{ color: '#97fce4', opacity: 0.8 }}>
            Discover the HyperEVM ecosystem and find new opportunities
          </p>
        </div>

        {/* Search Bar */}
        <Card
          className="mb-8"
          style={{ backgroundColor: '#021e17', borderColor: '#97fce4' }}
        >
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5"
                  style={{ color: '#97fce4', opacity: 0.7 }}
                />
                <input
                  type="text"
                  placeholder="Search tokens, contracts, or addresses..."
                  className="w-full pl-10 pr-4 py-3 border rounded-lg text-responsive-sm"
                  style={{
                    backgroundColor: '#0e1e27',
                    borderColor: '#97fce4',
                    color: '#97fce4',
                  }}
                />
              </div>
              <Button
                className="w-full sm:w-auto"
                style={{
                  backgroundColor: '#97fce4',
                  color: '#0e1e27',
                  border: 'none',
                }}
              >
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Explore Categories */}
        <div className="grid-responsive-4 gap-6">
          {exploreItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card
                key={index}
                className="cursor-pointer hover:scale-105 transition-transform"
                style={{ backgroundColor: '#021e17', borderColor: '#97fce4' }}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div
                      className="h-12 w-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: item.color, opacity: 0.2 }}
                    >
                      <Icon className="h-6 w-6" style={{ color: item.color }} />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      style={{ color: '#97fce4' }}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardTitle style={{ color: '#97fce4' }}>
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p style={{ color: '#97fce4', opacity: 0.8 }}>
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Trending Section */}
        <div className="mt-12">
          <h2 className="text-responsive-2xl font-bold mb-6" style={{ color: '#97fce4' }}>
            Trending
          </h2>
          <div className="grid-responsive-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(item => (
              <Card
                key={item}
                style={{ backgroundColor: '#021e17', borderColor: '#97fce4' }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className="h-10 w-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: '#97fce4', opacity: 0.2 }}
                      >
                        <span
                          className="text-sm font-bold"
                          style={{ color: '#97fce4' }}
                        >
                          {item}
                        </span>
                      </div>
                      <div>
                        <h3
                          className="font-semibold"
                          style={{ color: '#97fce4' }}
                        >
                          Token {item}
                        </h3>
                        <p
                          className="text-sm"
                          style={{ color: '#97fce4', opacity: 0.7 }}
                        >
                          TKN{item}
                        </p>
                      </div>
                    </div>
                    <Badge
                      style={{
                        backgroundColor: '#97fce4',
                        color: '#0e1e27',
                      }}
                    >
                      +{item * 12}%
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: '#97fce4', opacity: 0.7 }}>
                      Price
                    </span>
                    <span style={{ color: '#97fce4' }}>
                      ${(item * 0.5).toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
