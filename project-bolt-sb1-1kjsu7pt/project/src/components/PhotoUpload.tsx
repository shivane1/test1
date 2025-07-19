import React, { useRef } from 'react';
import { Upload, Image, X } from 'lucide-react';

interface PhotoUploadProps {
  onUpload: (imageData: string) => void;
  onCancel: () => void;
  faceNumber: number;
  isValidating: boolean;
  totalFaces: number;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  onUpload,
  onCancel,
  faceNumber,
  isValidating,
  totalFaces
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if it's an image file
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, etc.)');
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image file is too large. Please select a file smaller than 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      onUpload(imageData);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Upload Face {faceNumber} of {totalFaces}
          </h2>
          <p className="text-gray-600">
            Select a photo of this cube face from your device
          </p>
        </div>

        <div className="mb-6">
          <div 
            onClick={handleUploadClick}
            className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <Image className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Choose Photo
            </h3>
            <p className="text-gray-600 mb-4">
              Click here to select an image from your gallery
            </p>
            <div className="bg-blue-100 text-blue-800 text-sm rounded-lg p-3">
              <p className="font-medium mb-1">📸 Photo Tips:</p>
              <ul className="text-left space-y-1">
                <li>• All 9 squares should be clearly visible</li>
                <li>• Good lighting with no shadows</li>
                <li>• Face should be straight and centered</li>
                <li>• Avoid blurry or tilted photos</li>
              </ul>
            </div>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isValidating}
        />

        <div className="flex gap-4 justify-center">
          <button
            onClick={onCancel}
            disabled={isValidating}
            className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            <X className="w-5 h-5" />
            Cancel
          </button>
          
          <button
            onClick={handleUploadClick}
            disabled={isValidating}
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-lg"
          >
            {isValidating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Checking Photo...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Select Photo
              </>
            )}
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Supported formats: JPG, PNG, WebP • Max size: 10MB
          </p>
        </div>
      </div>
    </div>
  );
};