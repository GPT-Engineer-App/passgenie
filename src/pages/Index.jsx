import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { QRCodeSVG } from 'qrcode.react';
import * as QRCode from 'qrcode';
import { motion, AnimatePresence } from 'framer-motion';

const Index = () => {
  const [passData, setPassData] = useState({
    backgroundColor: '#FFFFFF',
    textColor: '#000000',
    url: '',
  });

  const [qrCodeType, setQrCodeType] = useState('standard');
  const [prettyQrCodeData, setPrettyQrCodeData] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPassData(prevData => ({ ...prevData, [name]: value }));
  };

  const generatePrettyQRCode = async () => {
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(passData.url, {
        errorCorrectionLevel: 'H',
        margin: 1,
        color: {
          dark: passData.textColor,
          light: passData.backgroundColor,
        },
      });
      setPrettyQrCodeData(qrCodeDataUrl);
    } catch (error) {
      console.error('Error generating pretty QR code:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (qrCodeType === 'pretty') {
      await generatePrettyQRCode();
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <linearGradient id="a" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF6B6B">
                <animate attributeName="stop-color" values="#FF6B6B; #4ECDC4; #45B7D1; #FF6B6B" dur="10s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="#4ECDC4">
                <animate attributeName="stop-color" values="#4ECDC4; #45B7D1; #FF6B6B; #4ECDC4" dur="10s" repeatCount="indefinite" />
              </stop>
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#a)">
            <animate attributeName="opacity" values="0.5;0.8;0.5" dur="10s" repeatCount="indefinite" />
          </rect>
        </svg>
      </div>
      <div className="relative z-10">
        <h1 className="text-4xl font-bold mb-8 text-center text-white">QR Code Generator</h1>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-white bg-opacity-90">
            <CardHeader>
              <CardTitle>QR Code Details</CardTitle>
              <CardDescription>Enter the details for your QR Code</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="url">URL for QR Code</Label>
                  <Input id="url" name="url" type="url" value={passData.url} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="backgroundColor">Background Color</Label>
                  <Input id="backgroundColor" name="backgroundColor" type="color" value={passData.backgroundColor} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="textColor">Text Color</Label>
                  <Input id="textColor" name="textColor" type="color" value={passData.textColor} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="qrCodeType">QR Code Type</Label>
                  <select
                    id="qrCodeType"
                    name="qrCodeType"
                    value={qrCodeType}
                    onChange={(e) => setQrCodeType(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="standard">Standard QR Code</option>
                    <option value="pretty">Pretty QR Code (AI-generated)</option>
                  </select>
                </div>
                <Button type="submit" className="w-full">Generate QR Code</Button>
              </form>
            </CardContent>
          </Card>
          
          <Card className="bg-white bg-opacity-90">
            <CardHeader>
              <CardTitle>QR Code Preview</CardTitle>
              <CardDescription>A preview of your generated QR code</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4" style={{ backgroundColor: passData.backgroundColor, color: passData.textColor }}>
                <div className="mt-4">
                  {qrCodeType === 'standard' ? (
                    <QRCodeSVG value={passData.url} size={128} className="mx-auto" bgColor={passData.backgroundColor} fgColor={passData.textColor} />
                  ) : (
                    prettyQrCodeData && (
                      <img
                        src={prettyQrCodeData}
                        alt="Pretty QR Code"
                        className="mx-auto"
                        style={{ width: '128px', height: '128px' }}
                      />
                    )
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;