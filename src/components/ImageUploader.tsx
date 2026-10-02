import React, { useRef, useState } from 'react';
import { processImageForStorage } from '../utils/imageUpload';
import styles from './ContentEditor.module.css';

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (base64Str: string) => void;
  aspectRatioText?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ label, value, onChange, aspectRatioText }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Must be an image file');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      const dataUrl = await processImageForStorage(file);
      
      // Simple check for localStorage limits. 
      // Most browsers limit around 5MB (which is roughly 5M chars in utf-16, but dataUrl is string so its len is roughly byte size * 1.37)
      if (dataUrl.length > 3_000_000) {
        setError('Image too large even after compression. Please use a smaller image.');
        return;
      }
      
      onChange(dataUrl);
    } catch (err) {
      console.error('Failed to process image:', err);
      setError('Failed to process image');
    } finally {
      setIsProcessing(false);
      // Reset input so the same file can be uploaded again if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className={styles.field} style={{ border: '1px dashed #333', padding: '10px', marginTop: '5px' }}>
      <label className={styles.fieldLabel}>{label} {aspectRatioText && <span style={{color: 'var(--accent-primary)', marginLeft: 8}}>{aspectRatioText}</span>}</label>
      
      {value ? (
        <div style={{ marginBottom: '10px' }}>
          <img 
            src={value} 
            alt="Preview" 
            style={{ 
              width: '100%', 
              maxHeight: '150px', 
              objectFit: 'contain', 
              background: '#000', 
              border: '1px solid #333' 
            }} 
          />
        </div>
      ) : null}
      
      {error && <div style={{ color: '#E60012', fontSize: '0.7rem', marginBottom: '8px' }}>{error}</div>}
      
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button 
          type="button" 
          className={styles.toolbarBtn} 
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
        >
          {isProcessing ? 'PROCESSING...' : (value ? 'REPLACE IMAGE' : 'UPLOAD IMAGE')}
        </button>
        
        {value && (
          <button 
            type="button" 
            className={styles.toolbarBtn} 
            style={{ borderColor: '#E60012', color: '#E60012' }}
            onClick={() => onChange('')}
          >
            REMOVE
          </button>
        )}
      </div>

      <input 
        ref={fileInputRef}
        type="file" 
        accept="image/*" 
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <div style={{ fontSize: '0.65rem', color: '#666', marginTop: '8px', fontFamily: 'var(--font-mono, monospace)' }}>
        Note: Image will be resized and compressed automatically for local storage.
      </div>
    </div>
  );
};
