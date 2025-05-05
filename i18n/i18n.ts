import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';

// Locales
import en from './locales/en.json';
import vi from './locales/vi.json';

const LANGUAGE_DETECTOR = {
  type: 'languageDetector',
  async: true, 
  detect: async (callback: (lng: string) => void) => {
    try {
      // Kiểm tra nếu người dùng đã lưu ngôn ngữ
      const storedLang = await AsyncStorage.getItem('APP_LANGUAGE');
      if (storedLang) {
        return callback(storedLang);
      } else {
        // Nếu chưa có, sử dụng ngôn ngữ hệ thống hoặc mặc định là tiếng Việt
        const deviceLang = Localization.locale.split('-')[0];
        return callback(deviceLang === 'vi' ? 'vi' : 'vi'); // Mặc định tiếng Việt
      }
    } catch (error) {
      console.error('Error reading language from storage:', error);
      // Mặc định tiếng Việt nếu có lỗi
      return callback('vi');
    }
  },
  init: () => {},
  cacheUserLanguage: async (lng: string) => {
    try {
      await AsyncStorage.setItem('APP_LANGUAGE', lng);
    } catch (error) {
      console.error('Error saving language to storage:', error);
    }
  }
};

i18n
  .use(LANGUAGE_DETECTOR)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en
      },
      vi: {
        translation: vi
      }
    },
    // Ngôn ngữ dự phòng nếu không có bản dịch
    fallbackLng: 'vi',
    compatibilityJSON: 'v3',
    interpolation: {
      escapeValue: false, // react đã tự động xử lý escape
    },
    react: {
      useSuspense: false,
    },
    // Ngôn ngữ mặc định
    lng: 'vi',
    ns: ['translation'],
    defaultNS: 'translation'
  });

export default i18n;

// Hàm tiện ích để chuyển đổi ngôn ngữ
export const changeLanguage = async (language: 'en' | 'vi') => {
  await AsyncStorage.setItem('APP_LANGUAGE', language);
  await i18n.changeLanguage(language);
};

// Hook để lấy ngôn ngữ hiện tại
export const getCurrentLanguage = (): string => {
  return i18n.language || 'vi';
};