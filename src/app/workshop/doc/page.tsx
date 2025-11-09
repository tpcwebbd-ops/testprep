'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadButton } from '@/lib/uploadthing';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UploadedFile {
  url: string;
  name: string;
  key: string;
  uploadedAt: string;
}

const Page = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Document Management System</h1>

      <Tabs defaultValue="admin" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="admin">Admin</TabsTrigger>
          <TabsTrigger value="client">Client</TabsTrigger>
        </TabsList>

        <TabsContent value="admin" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Documents</CardTitle>
              <CardDescription>Upload Microsoft Word documents (.docx) or Google Docs</CardDescription>
            </CardHeader>
            <CardContent>
              <UploadButton
                endpoint="documentUploader"
                onClientUploadComplete={res => {
                  if (res) {
                    const newFiles = res.map(file => ({
                      url: file.url,
                      name: file.name,
                      key: file.key,
                      uploadedAt: new Date().toISOString(),
                    }));
                    setUploadedFiles(prev => [...prev, ...newFiles]);
                  }
                }}
                onUploadError={(error: Error) => {
                  alert(`Upload error: ${error.message}`);
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="client" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Uploaded Documents</CardTitle>
              <CardDescription>View and download uploaded documents</CardDescription>
            </CardHeader>
            <CardContent>
              {uploadedFiles.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No documents uploaded yet</p>
              ) : (
                <div className="space-y-3">
                  {uploadedFiles.map(file => (
                    <div key={file.key} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">{new Date(file.uploadedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => window.open(file.url, '_blank')}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default Page;
