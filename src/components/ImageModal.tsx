
import React from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { X, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from './ui/button';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  imageAlt: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, imageUrl, imageAlt }) => {
  const [isZoomed, setIsZoomed] = React.useState(false);

  const handleClose = () => {
    setIsZoomed(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/90 border-none">
        <div className="relative w-full h-full flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
            onClick={handleClose}
          >
            <X className="h-6 w-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 z-50 text-white hover:bg-white/20"
            onClick={() => setIsZoomed(!isZoomed)}
          >
            {isZoomed ? <ZoomOut className="h-6 w-6" /> : <ZoomIn className="h-6 w-6" />}
          </Button>

          <img
            src={imageUrl}
            alt={imageAlt}
            className={`max-w-full max-h-full object-contain transition-transform duration-300 cursor-pointer ${
              isZoomed ? 'scale-150' : 'scale-100'
            }`}
            onClick={() => setIsZoomed(!isZoomed)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
