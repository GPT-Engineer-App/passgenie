import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from 'qrcode.react';

const SavedPasses = () => {
  const [savedPasses, setSavedPasses] = useState([]);

  useEffect(() => {
    const passes = JSON.parse(localStorage.getItem('savedPasses')) || [];
    setSavedPasses(passes);
  }, []);

  const deletePass = (index) => {
    const updatedPasses = savedPasses.filter((_, i) => i !== index);
    setSavedPasses(updatedPasses);
    localStorage.setItem('savedPasses', JSON.stringify(updatedPasses));
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-center">Saved Passes</h1>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {savedPasses.map((pass, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{pass.title}</CardTitle>
              <CardDescription>Issued by: {pass.issuerName}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4" style={{ backgroundColor: pass.backgroundColor, color: pass.textColor }}>
                {pass.logo && <img src={pass.logo} alt="Logo" className="w-16 h-16 mb-2 mx-auto object-cover" />}
                {pass.heroImage && <img src={pass.heroImage} alt="Hero" className="w-full h-32 mb-2 mx-auto object-cover" />}
                <p className="text-sm">{pass.description}</p>
                {pass.qrCodeUrl && (
                  <div className="mt-4">
                    <QRCodeSVG value={pass.qrCodeUrl} size={128} className="mx-auto" />
                  </div>
                )}
              </div>
              <Button variant="destructive" className="mt-4 w-full" onClick={() => deletePass(index)}>
                Delete Pass
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SavedPasses;
