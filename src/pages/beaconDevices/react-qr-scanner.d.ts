declare module 'react-qr-scanner' {
    export interface QrReaderProps {
      onScan?: (data: string | null) => void;
      onError?: (error: any) => void;
      style?: React.CSSProperties;
      // Add other props based on your usage
    }
  
    export const QrReader: React.FC<QrReaderProps>;
  }
  