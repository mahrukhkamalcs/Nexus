import React, { useEffect, useState } from "react";
import {
  FileText,
  Upload,
  Download,
  Trash2,
  Share2,
} from "lucide-react";

import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";

import {
  getDocuments,
  uploadDocument,
  deleteDocument,
  shareDocument,
} from "../../api/documentApi";

interface DocumentType {
  _id: string;
  name: string;
  type: string;
  size: string;
  lastModified: string;
  shared: boolean;
  fileUrl?: string;
}

export const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const data = await getDocuments();
      setDocuments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      await uploadDocument(file);
      loadDocuments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this document?")) return;

    try {
      await deleteDocument(id);
      loadDocuments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = async (id: string) => {
    try {
      await shareDocument(id);
      loadDocuments();
    } catch (err) {
      console.error(err);
    }
  };

  const storageUsed = documents.length * 2.5;
  const storagePercent = Math.min(storageUsed * 5, 100);
 return (
  <div className="space-y-6 animate-fade-in">
    {/* Header */}
    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
        <p className="text-gray-600">
          Manage your startup's important files
        </p>
      </div>

     <label className="cursor-pointer">
  <input
    type="file"
    hidden
    onChange={handleUpload}
  />

  <Button leftIcon={<Upload size={18} />}>
    Upload Document
  </Button>
</label>
    </div>

    {loading ? (
      <div className="flex justify-center items-center py-16">
        <p className="text-gray-500">Loading documents...</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Storage Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <h2 className="text-lg font-semibold">
              Storage
            </h2>
          </CardHeader>

          <CardBody className="space-y-4">
            <div>
              <div className="flex justify-between text-sm">
                <span>Used</span>
                <span>{storageUsed.toFixed(1)} GB</span>
              </div>

              <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                <div
                  className="h-2 bg-primary-600 rounded-full"
                  style={{
                    width: `${storagePercent}%`,
                  }}
                />
              </div>

              <div className="flex justify-between mt-2 text-sm">
                <span>Available</span>
                <span>
                  {(20 - storageUsed).toFixed(1)} GB
                </span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-3">
                Quick Access
              </h3>

              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">
                  Recent Files
                </button>
                <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">
                  Shared with Me
                </button>
                <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">
                  Starred
                </button>
                <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">
                  Trash
                </button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Documents */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                All Documents
              </h2>
              <span className="text-sm text-gray-500">
                {documents.length} files
              </span>
            </CardHeader>

            <CardBody>
              {documents.length === 0 ? (
                <div className="py-16 text-center">
                  <FileText
                    size={60}
                    className="mx-auto text-gray-300 mb-4"
                  />
                  <h3 className="text-xl font-semibold text-gray-700">
                    No Documents Yet
                  </h3>
                  <p className="text-gray-500 mt-2">
                    Upload your first document to get started.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div
                      key={doc._id}
                      className="flex items-center p-4 rounded-lg hover:bg-gray-50 transition border"
                    >
                      <div className="p-3 bg-primary-100 rounded-lg mr-4">
                        <FileText
                          size={26}
                          className="text-primary-600"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">
                            {doc.name}
                          </h3>
                          {doc.shared && (
                            <Badge
                              variant="secondary"
                              size="sm"
                            >
                              Shared
                            </Badge>
                          )}
                        </div>

                        <div className="text-sm text-gray-500 mt-1">
                          {doc.type} • {doc.size} • Modified{" "}
                          {new Date(doc.lastModified).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Unified Actions Group Container */}
                      <div className="flex items-center gap-2">
                        {doc.fileUrl && (
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-2"
                              aria-label="Download"
                            >
                              <Download size={18} />
                            </Button>
                          </a>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-2"
                          aria-label="Share"
                          onClick={() => handleShare(doc._id)}
                        >
                          <Share2 size={18} />
                        </Button>

                      <Button
  variant="ghost"
  size="sm"
  aria-label="Delete"
  className="p-2 text-red-600 hover:text-red-700"
  onClick={() => handleDelete(doc._id)}
>
  <Trash2 size={18} />
</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    )}
  </div>
);
};