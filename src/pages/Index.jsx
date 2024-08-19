import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { QRCodeSVG } from 'qrcode.react';
import * as QRCode from 'qrcode';
import { Checkbox } from "@/components/ui/checkbox"
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Index = () => {
  const navigate = useNavigate();
  const [passData, setPassData] = useState({
    title: '',
    issuerName: '',
    cardNumber: '',
    expirationDate: '',
    cardholderName: '',
    cvv: '',
    logo: '',
    heroImage: '',
    description: '',
    backgroundColor: '#FFFFFF',
    textColor: '#000000',
    frontImage: null,
    backImage: null,
    additionalInfo: '',
  });

  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [qrCodeType, setQrCodeType] = useState('standard');
  const [errorMessage, setErrorMessage] = useState('');
  const [nfcSupported, setNfcSupported] = useState(false);
  const [nfcReading, setNfcReading] = useState(false);
  const [nfcData, setNfcData] = useState(null);
  const [selectedQRFields, setSelectedQRFields] = useState({
    title: false,
    issuerName: false,
    cardNumber: false,
    expirationDate: false,
    cardholderName: false,
    cvv: false,
  });

  const frontImageRef = useRef(null);
  const backImageRef = useRef(null);

  useEffect(() => {
    if ('NDEFReader' in window) {
      setNfcSupported(true);
    }
  }, []);

  const startNfcScan = async () => {
    if (!nfcSupported) {
      setErrorMessage('NFC is not supported on this device or browser.');
      return;
    }

    try {
      setNfcReading(true);
      const ndef = new NDEFReader();
      await ndef.scan();

      ndef.addEventListener("reading", ({ message, serialNumber }) => {
        console.log(`> Serial Number: ${serialNumber}`);
        console.log(`> Records: (${message.records.length})`);

        const nfcDataObj = {
          serialNumber,
          records: message.records.map(record => ({
            recordType: record.recordType,
            mediaType: record.mediaType,
            data: record.data
          }))
        };

        setNfcData(nfcDataObj);
        setPassData(prevData => ({
          ...prevData,
          cardNumber: nfcDataObj.serialNumber,
          additionalInfo: JSON.stringify(nfcDataObj.records, null, 2)
        }));
        setNfcReading(false);
      });

    } catch (error) {
      console.error(error);
      setErrorMessage(`Error reading NFC: ${error.message}`);
      setNfcReading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      if (file) {
        const img = new Image();
        img.onload = function() {
          if (this.width < 300 || this.height < 300) {
            setErrorMessage(`The ${name === 'frontImage' ? 'front' : 'back'} image resolution is too low. Please upload a higher quality image.`);
            e.target.value = '';
          } else {
            setPassData(prevData => ({ ...prevData, [name]: file }));
            setErrorMessage('');
          }
        };
        img.src = URL.createObjectURL(file);
      }
    } else {
      setPassData(prevData => ({ ...prevData, [name]: value }));
    }
  };

  const generateQRCode = () => {
    const qrData = {};
    Object.keys(selectedQRFields).forEach(field => {
      if (selectedQRFields[field]) {
        qrData[field] = passData[field];
      }
    });
    return JSON.stringify(qrData);
  };

  const generatePrettyQRCode = async () => {
    try {
      const qrData = generateQRCode();
      const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
        errorCorrectionLevel: 'H',
        margin: 1,
        color: {
          dark: passData.textColor,
          light: passData.backgroundColor,
        },
      });
      return qrCodeDataUrl;
    } catch (error) {
      console.error('Error generating pretty QR code:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!privacyAgreed) {
      alert('Please agree to the privacy statement before generating the pass.');
      return;
    }
    const qrCodeData = generateQRCode();
    const prettyQrCodeData = await generatePrettyQRCode();
    const passWithQR = { ...passData, qrCodeData, prettyQrCodeData };
    
    // Save the pass data to localStorage
    const savedPasses = JSON.parse(localStorage.getItem('savedPasses')) || [];
    savedPasses.push(passWithQR);
    localStorage.setItem('savedPasses', JSON.stringify(savedPasses));

    alert('Pass generated and saved!');
    navigate('/saved-passes');
  };

  const handleQRFieldChange = (field) => {
    setSelectedQRFields(prev => ({ ...prev, [field]: !prev[field] }));
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
        <h1 className="text-4xl font-bold mb-8 text-center text-white">Google Wallet Pass Generator</h1>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-white bg-opacity-90">
            <CardHeader>
              <CardTitle>Pass Details</CardTitle>
              <CardDescription>Enter the details for your Google Wallet Pass</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label>QR Code Fields</Label>
                <div className="space-y-2 mt-2">
                  {Object.keys(selectedQRFields).map((field) => (
                    <div key={field} className="flex items-center">
                      <Checkbox
                        id={`qr-${field}`}
                        checked={selectedQRFields[field]}
                        onCheckedChange={() => handleQRFieldChange(field)}
                      />
                      <label htmlFor={`qr-${field}`} className="ml-2 text-sm">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <AnimatePresence>
                {Object.keys(selectedQRFields).map((field) => 
                  selectedQRFields[field] && (
                    <motion.div
                      key={field}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Label htmlFor={`qr-${field}-value`}>{field.charAt(0).toUpperCase() + field.slice(1)} for QR Code</Label>
                      <Input
                        id={`qr-${field}-value`}
                        name={`qr-${field}-value`}
                        value={passData[field]}
                        onChange={(e) => setPassData(prev => ({ ...prev, [field]: e.target.value }))}
                        className="mt-1 mb-2"
                      />
                    </motion.div>
                  )
                )}
              </AnimatePresence>
              <form onSubmit={handleSubmit} className="space-y-4">
                {nfcSupported && (
                  <div className="mb-4">
                    <Button onClick={startNfcScan} disabled={nfcReading} className="w-full">
                      {nfcReading ? 'Scanning NFC...' : 'Scan NFC Card'}
                    </Button>
                  </div>
                )}
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" value={passData.title} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="issuerName">Issuer Name</Label>
                  <Input id="issuerName" name="issuerName" value={passData.issuerName} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input id="cardNumber" name="cardNumber" value={passData.cardNumber} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="expirationDate">Expiration Date</Label>
                  <Input id="expirationDate" name="expirationDate" type="date" value={passData.expirationDate} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="cardholderName">Cardholder Name</Label>
                  <Input id="cardholderName" name="cardholderName" value={passData.cardholderName} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" name="cvv" value={passData.cvv} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="logo">Logo URL</Label>
                  <Input id="logo" name="logo" type="url" value={passData.logo} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="heroImage">Hero Image URL</Label>
                  <Input id="heroImage" name="heroImage" type="url" value={passData.heroImage} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" value={passData.description} onChange={handleInputChange} />
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
                  <Label htmlFor="frontImage">Front Image</Label>
                  <Input id="frontImage" name="frontImage" type="file" accept="image/*" onChange={handleInputChange} ref={frontImageRef} required />
                </div>
                <div>
                  <Label htmlFor="backImage">Back Image</Label>
                  <Input id="backImage" name="backImage" type="file" accept="image/*" onChange={handleInputChange} ref={backImageRef} required />
                </div>
                <div>
                  <Label htmlFor="additionalInfo">Additional Information</Label>
                  <Textarea id="additionalInfo" name="additionalInfo" value={passData.additionalInfo} onChange={handleInputChange} />
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
                <div className="flex items-center space-x-2">
                  <Checkbox id="privacyAgreement" checked={privacyAgreed} onCheckedChange={setPrivacyAgreed} />
                  <label htmlFor="privacyAgreement" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    I understand that I am responsible for the accuracy of the information provided
                  </label>
                </div>
                {errorMessage && (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full">Generate Pass</Button>
              </form>
            </CardContent>
          </Card>
          
          <div className="space-y-8">
            <Card className="bg-white bg-opacity-90">
              <CardHeader>
                <CardTitle>NFC Data</CardTitle>
              </CardHeader>
              <CardContent>
                {nfcData ? (
                  <div>
                    <p><strong>Serial Number:</strong> {nfcData.serialNumber}</p>
                    <p><strong>Records:</strong></p>
                    <pre className="bg-gray-100 p-2 rounded mt-2 overflow-x-auto">
                      {JSON.stringify(nfcData.records, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <p>No NFC data available. Use the "Scan NFC Card" button to read an NFC card.</p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white bg-opacity-90">
              <CardHeader>
                <CardTitle>Pass Preview</CardTitle>
                <CardDescription>A simple preview of your pass</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4" style={{ backgroundColor: passData.backgroundColor, color: passData.textColor }}>
                  <h2 className="text-xl font-bold mb-2">{passData.title || 'Pass Title'}</h2>
                  <p className="text-sm mb-2">Issued by: {passData.issuerName || 'Issuer Name'}</p>
                  {passData.logo && <img src={passData.logo} alt="Logo" className="w-16 h-16 mb-2 mx-auto object-cover" />}
                  {passData.heroImage && <img src={passData.heroImage} alt="Hero" className="w-full h-32 mb-2 mx-auto object-cover" />}
                  <p className="text-sm">{passData.description || 'Pass description will appear here'}</p>
                  <div className="mt-4">
                    {qrCodeType === 'standard' ? (
                      <QRCodeSVG value={generateQRCode()} size={128} className="mx-auto" />
                    ) : (
                      <img
                        src={generatePrettyQRCode()}
                        alt="Pretty QR Code"
                        className="mx-auto"
                        style={{ width: '128px', height: '128px' }}
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;