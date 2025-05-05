import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { changeLanguage, getCurrentLanguage } from '../i18n/i18n';

interface LanguageSelectorProps {
  style?: any;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ style }) => {
  const { t } = useTranslation();
  const currentLang = getCurrentLanguage();

  const toggleLanguage = async () => {
    const newLang = currentLang === 'vi' ? 'en' : 'vi';
    await changeLanguage(newLang);
  };

  return (
    <TouchableOpacity onPress={toggleLanguage} style={[styles.container, style]}>
      <Text style={styles.languageText}>
        {currentLang === 'vi' ? '🇻🇳 VI' : '🇺🇸 EN'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  languageText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default LanguageSelector;