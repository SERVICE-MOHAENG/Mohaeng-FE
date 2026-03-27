import React, { createContext, useContext, useState, useCallback } from 'react';
import Alert from '../components/Alert';

type AlertType = 'info' | 'success' | 'error' | 'warning';

interface AlertContextType {
  showAlert: (message: string, type?: AlertType) => void;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<AlertType>('info');

  const showAlert = useCallback((msg: string, t: AlertType = 'info') => {
    setMessage(msg);
    setType(t);
    setIsOpen(true);
  }, []);

  const hideAlert = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      <Alert 
        isOpen={isOpen} 
        message={message} 
        type={type} 
        onClose={hideAlert} 
      />
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};
