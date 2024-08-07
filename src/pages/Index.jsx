import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { QRCodeSVG } from 'qrcode.react';

const Index = () => {
  const [passData, setPassData] = useState({
    title: '',
    issuerName: '',
    logo: '',
    heroImage: '',
    description: '',
    backgroundColor: '#FFFFFF',
    textColor: '#000000',
    qrCodeUrl: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPassData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to a backend to generate the actual pass
    console.log('Pass data submitted:', passData);
    // For demo purposes, we'll just alert the user
    alert('Pass generated! (In a real app, this would download the pass)');
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-center">Google Wallet Pass Generator</h1>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Pass Details</CardTitle>
            <CardDescription>Enter the details for your Google Wallet Pass</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" value={passData.title} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="issuerName">Issuer Name</Label>
                <Input id="issuerName" name="issuerName" value={passData.issuerName} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="logo">Logo URL</Label>
                <Input id="logo" name="logo" type="url" value={passData.logo} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="heroImage">Hero Image URL</Label>
                <Input id="heroImage" name="heroImage" type="url" value={passData.heroImage} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={passData.description} onChange={handleInputChange} required />
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
                <Label htmlFor="qrCodeUrl">QR Code URL</Label>
                <Input id="qrCodeUrl" name="qrCodeUrl" type="url" value={passData.qrCodeUrl} onChange={handleInputChange} placeholder="https://example.com" />
              </div>
              <Button type="submit" className="w-full">Generate Pass</Button>
            </form>
          </CardContent>
        </Card>
        
        <Card>
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
              {passData.qrCodeUrl && (
                <div className="mt-4">
                  <QRCodeSVG value={passData.qrCodeUrl} size={128} className="mx-auto" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
