import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { RootState } from '../store';
import { clearToast } from '../store/uiSlice';
import { Toast, ToastProvider, ToastViewport, ToastTitle, ToastDescription, ToastClose } from './ui/toast';

const ToastNotification: React.FC = () => {
  const dispatch = useDispatch();
  const { toastMessage, toastType } = useSelector((state: RootState) => state.ui);
  
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        dispatch(clearToast());
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [toastMessage, dispatch]);
  
  if (!toastMessage) return null;
  
  const getIcon = () => {
    switch (toastType) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };
  
  return (
    <ToastProvider>
      <Toast className="bg-card border border-border">
        <div className="flex">
          <div className="mr-3">
            {getIcon()}
          </div>
          <div className="grid gap-1">
            <ToastTitle className="text-sm font-medium">
              {toastType === 'success' ? 'Success' : toastType === 'error' ? 'Error' : 'Info'}
            </ToastTitle>
            <ToastDescription className="text-sm text-muted-foreground">
              {toastMessage}
            </ToastDescription>
          </div>
        </div>
        <ToastClose onClick={() => dispatch(clearToast())}>
          <X className="h-4 w-4" />
        </ToastClose>
      </Toast>
      <ToastViewport />
    </ToastProvider>
  );
};

export default ToastNotification;