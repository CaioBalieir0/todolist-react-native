import Toast from 'react-native-toast-message';

/**
 * Utilitário para exibir toasts no app
 * Similar ao Sonner do React, mas para React Native
 */

// Toast de sucesso
export const showSuccess = (message, description = '') => {
  Toast.show({
    type: 'success',
    text1: message,
    text2: description,
    position: 'top',
    visibilityTime: 3000,
  });
};

// Toast de erro
export const showError = (message, description = '') => {
  Toast.show({
    type: 'error',
    text1: message,
    text2: description,
    position: 'top',
    visibilityTime: 4000,
  });
};

// Toast de informação
export const showInfo = (message, description = '') => {
  Toast.show({
    type: 'info',
    text1: message,
    text2: description,
    position: 'top',
    visibilityTime: 3000,
  });
};

// Toast padrão
export const showToast = (message, description = '') => {
  Toast.show({
    type: 'success',
    text1: message,
    text2: description,
    position: 'top',
    visibilityTime: 3000,
  });
};

// Exporta o Toast diretamente para casos mais avançados
export default Toast;
