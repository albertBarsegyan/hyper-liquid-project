import React, { useEffect, useRef, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx';
import { Button } from '@/components/ui/button.tsx';
import { TrendingUp } from 'lucide-react';
import {
  ColorType,
  createChart,
  type LineData,
  LineSeries,
  type Time,
} from 'lightweight-charts';
import { useAlert } from '@/modules/shared/contexts/alert-context';

// Generate mock trading data
const generateMockData = (): LineData<Time>[] => {
  const data: LineData<Time>[] = [];
  const basePrice = 100;
  let time = Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60; // 30 days ago

  for (let i = 0; i < 100; i++) {
    const randomChange = (Math.random() - 0.5) * 10;
    const price = basePrice + randomChange + i * 0.5;
    data.push({
      time: time as never,
      value: price,
    });
    time += 24 * 60 * 60; // Add 1 day
  }
  return data;
};

// Trading Chart Component
const TradingChart: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#0e1e27' },
        textColor: '#97fce4',
      },
      grid: {
        vertLines: { color: '#97fce4', style: 1, visible: true },
        horzLines: { color: '#97fce4', style: 1, visible: true },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
    });

    const lineSeries = chart.addSeries(LineSeries, {
      color: '#97fce4',
      lineWidth: 2,
    });

    const mockData = generateMockData();
    lineSeries.setData(mockData);

    chart.timeScale().fitContent();

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  return <div ref={chartContainerRef} />;
};

// Validation function to allow only numbers and decimal point
const validateNumericInput = (value: string): string => {
  // Allow empty string
  if (value === '') return '';

  // Remove any non-numeric characters except decimal point
  let sanitized = value.replace(/[^\d.]/g, '');

  // Ensure only one decimal point
  const parts = sanitized.split('.');
  if (parts.length > 2) {
    sanitized = parts[0] + '.' + parts.slice(1).join('');
  }

  // Prevent multiple leading zeros (but allow 0.xxx)
  if (sanitized.startsWith('00') && !sanitized.startsWith('0.')) {
    sanitized = sanitized.replace(/^0+/, '0');
  }

  return sanitized;
};

const TradingPage: React.FC = () => {
  const { showAlert } = useAlert();

  // Trading state
  const [buyAmount, setBuyAmount] = useState<string>('');
  const [sellAmount, setSellAmount] = useState<string>('');
  const CURRENT_PRICE = 105.5; // Mock current price

  // Trading handlers
  const handleBuy = () => {
    if (
      !buyAmount ||
      isNaN(parseFloat(buyAmount)) ||
      parseFloat(buyAmount) <= 0
    ) {
      showAlert({
        variant: 'error',
        message: 'Please enter a valid buy amount',
      });
      return;
    }

    const totalCost = parseFloat(buyAmount) * CURRENT_PRICE;
    showAlert({
      variant: 'success',
      message: `Buy order placed: ${buyAmount} units at $${CURRENT_PRICE.toFixed(2)} (Total: $${totalCost.toFixed(2)})`,
    });
    setBuyAmount('');
  };

  const handleSell = () => {
    if (
      !sellAmount ||
      isNaN(parseFloat(sellAmount)) ||
      parseFloat(sellAmount) <= 0
    ) {
      showAlert({
        variant: 'error',
        message: 'Please enter a valid sell amount',
      });
      return;
    }

    const totalValue = parseFloat(sellAmount) * CURRENT_PRICE;
    showAlert({
      variant: 'success',
      message: `Sell order placed: ${sellAmount} units at $${CURRENT_PRICE.toFixed(2)} (Total: $${totalValue.toFixed(2)})`,
    });
    setSellAmount('');
  };

  return (
    <div className="container-responsive py-responsive">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#97fce4' }}>
          Trading
        </h1>
        <p style={{ color: '#97fce4', opacity: 0.8 }}>
          Live price chart and trading interface
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Trading Section */}
        <Card style={{ backgroundColor: '#021e17', borderColor: '#97fce4' }}>
          <CardHeader>
            <CardTitle
              className="flex items-center"
              style={{ color: '#97fce4' }}
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              Market Chart
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Attribution for TradingView Lightweight Charts */}
            <div
              className="text-xs p-2 rounded"
              style={{
                backgroundColor: '#0e1e27',
                color: '#97fce4',
                opacity: 0.7,
              }}
            >
              Chart powered by{' '}
              <a
                href="https://www.tradingview.com/lightweight-charts/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:opacity-100"
                style={{ color: '#97fce4' }}
              >
                TradingView Lightweight Charts™
              </a>
            </div>

            {/* Chart */}
            <div
              className="rounded-lg overflow-hidden border"
              style={{ borderColor: '#97fce4' }}
            >
              <TradingChart />
            </div>

            {/* Current Price Display */}
            <div
              className="p-4 rounded-lg text-center"
              style={{ backgroundColor: '#0e1e27' }}
            >
              <p
                className="text-sm font-medium mb-1"
                style={{ color: '#97fce4', opacity: 0.8 }}
              >
                Current Price
              </p>
              <p className="text-3xl font-bold" style={{ color: '#97fce4' }}>
                ${CURRENT_PRICE.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Buy/Sell Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Buy Card */}
          <Card style={{ backgroundColor: '#021e17', borderColor: '#97fce4' }}>
            <CardHeader>
              <CardTitle style={{ color: '#97fce4' }}>Buy</CardTitle>
              <p style={{ color: '#97fce4', opacity: 0.8 }}>
                Place a buy order
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: '#97fce4', opacity: 0.8 }}
                >
                  Amount
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={buyAmount}
                  onChange={e =>
                    setBuyAmount(validateNumericInput(e.target.value))
                  }
                  placeholder="0.0"
                  className="w-full p-3 border rounded-lg"
                  style={{
                    backgroundColor: '#0e1e27',
                    borderColor: '#97fce4',
                    color: '#97fce4',
                  }}
                />
              </div>
              {buyAmount &&
                !isNaN(parseFloat(buyAmount)) &&
                parseFloat(buyAmount) > 0 && (
                  <div
                    className="text-sm p-3 rounded"
                    style={{
                      backgroundColor: '#0e1e27',
                      color: '#97fce4',
                    }}
                  >
                    <div className="flex justify-between mb-1">
                      <span style={{ opacity: 0.8 }}>Price per unit:</span>
                      <span className="font-semibold">
                        ${CURRENT_PRICE.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ opacity: 0.8 }}>Total cost:</span>
                      <span className="font-semibold">
                        ${(parseFloat(buyAmount) * CURRENT_PRICE).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              <Button
                className="w-full"
                onClick={handleBuy}
                disabled={
                  !buyAmount ||
                  isNaN(parseFloat(buyAmount)) ||
                  parseFloat(buyAmount) <= 0
                }
                style={{
                  backgroundColor: '#22c55e',
                  color: '#ffffff',
                  border: 'none',
                  opacity:
                    !buyAmount ||
                    isNaN(parseFloat(buyAmount)) ||
                    parseFloat(buyAmount) <= 0
                      ? 0.5
                      : 1,
                }}
              >
                Buy
              </Button>
            </CardContent>
          </Card>

          {/* Sell Card */}
          <Card style={{ backgroundColor: '#021e17', borderColor: '#97fce4' }}>
            <CardHeader>
              <CardTitle style={{ color: '#97fce4' }}>Sell</CardTitle>
              <p style={{ color: '#97fce4', opacity: 0.8 }}>
                Place a sell order
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: '#97fce4', opacity: 0.8 }}
                >
                  Amount
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={sellAmount}
                  onChange={e =>
                    setSellAmount(validateNumericInput(e.target.value))
                  }
                  placeholder="0.0"
                  className="w-full p-3 border rounded-lg"
                  style={{
                    backgroundColor: '#0e1e27',
                    borderColor: '#97fce4',
                    color: '#97fce4',
                  }}
                />
              </div>
              {sellAmount &&
                !isNaN(parseFloat(sellAmount)) &&
                parseFloat(sellAmount) > 0 && (
                  <div
                    className="text-sm p-3 rounded"
                    style={{
                      backgroundColor: '#0e1e27',
                      color: '#97fce4',
                    }}
                  >
                    <div className="flex justify-between mb-1">
                      <span style={{ opacity: 0.8 }}>Price per unit:</span>
                      <span className="font-semibold">
                        ${CURRENT_PRICE.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ opacity: 0.8 }}>Total value:</span>
                      <span className="font-semibold">
                        ${(parseFloat(sellAmount) * CURRENT_PRICE).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              <Button
                className="w-full"
                onClick={handleSell}
                disabled={
                  !sellAmount ||
                  isNaN(parseFloat(sellAmount)) ||
                  parseFloat(sellAmount) <= 0
                }
                style={{
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  border: 'none',
                  opacity:
                    !sellAmount ||
                    isNaN(parseFloat(sellAmount)) ||
                    parseFloat(sellAmount) <= 0
                      ? 0.5
                      : 1,
                }}
              >
                Sell
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TradingPage;

