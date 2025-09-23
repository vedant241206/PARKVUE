import { useState, useEffect } from 'react';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    'welcome': 'Welcome to PARKVUE',
    'tagline': 'Find, Book & Park with Ease',
    'skip_hassle': 'Skip the hassle of finding parking. Get your spot assigned instantly!',
    'time_not_wasted': 'Because time should not be wasted parking!',
    'normal_spots': 'Normal Spots',
    'vip_spots': 'VIP Spots',
    'ev_charging': 'EV Charging',
    'book_parking': 'Book Parking Spot',
    'exit_parking': 'Exit Parking',
    'admin_dashboard': 'Admin Dashboard',
    'verify_identity': 'Verify Your Identity',
    'phone_verification': 'Phone Verification',
    'email_verification': 'Email Verification',
    'choose_plan': 'Choose Your Parking Plan',
    'select_plan': 'Select Plan',
    'payment_details': 'Payment Details',
    'booking_confirmed': 'Booking Confirmed!',
    'download_receipt': 'Download Receipt',
    'proceed_to_gate': 'Proceed to Gate'
  },
  hi: {
    'welcome': 'PARKVUE में आपका स्वागत है',
    'tagline': 'खोजें, बुक करें और आसानी से पार्क करें',
    'skip_hassle': 'पार्किंग खोजने की परेशानी छोड़ें। तुरंत अपना स्पॉट असाइन कराएं!',
    'time_not_wasted': 'क्योंकि समय पार्किंग में बर्बाद नहीं होना चाहिए!',
    'normal_spots': 'सामान्य स्पॉट्स',
    'vip_spots': 'VIP स्पॉट्स',
    'ev_charging': 'EV चार्जिंग',
    'book_parking': 'पार्किंग स्पॉट बुक करें',
    'exit_parking': 'पार्किंग से बाहर निकलें',
    'admin_dashboard': 'एडमिन डैशबोर्ड',
    'verify_identity': 'अपनी पहचान सत्यापित करें',
    'phone_verification': 'फोन सत्यापन',
    'email_verification': 'ईमेल सत्यापन',
    'choose_plan': 'अपना पार्किंग प्लान चुनें',
    'select_plan': 'प्लान चुनें',
    'payment_details': 'भुगतान विवरण',
    'booking_confirmed': 'बुकिंग कन्फर्म!',
    'download_receipt': 'रसीद डाउनलोड करें',
    'proceed_to_gate': 'गेट पर जाएं'
  },
  mr: {
    'welcome': 'PARKVUE मध्ये तुमचे स्वागत आहे',
    'tagline': 'शोधा, बुक करा आणि सहजतेने पार्क करा',
    'skip_hassle': 'पार्किंग शोधण्याची गैरसोय टाळा. तुमचे स्पॉट लगेच असाइन करा!',
    'time_not_wasted': 'कारण वेळ पार्किंगमध्ये वाया घालवू नये!',
    'normal_spots': 'सामान्य स्पॉट्स',
    'vip_spots': 'VIP स्पॉट्स',
    'ev_charging': 'EV चार्जिंग',
    'book_parking': 'पार्किंग स्पॉट बुक करा',
    'exit_parking': 'पार्किंगमधून बाहेर पडा',
    'admin_dashboard': 'अॅडमिन डॅशबोर्ड',
    'verify_identity': 'तुमची ओळख सत्यापित करा',
    'phone_verification': 'फोन सत्यापन',
    'email_verification': 'ईमेल सत्यापन',
    'choose_plan': 'तुमचा पार्किंग प्लान निवडा',
    'select_plan': 'प्लान निवडा',
    'payment_details': 'पेमेंट तपशील',
    'booking_confirmed': 'बुकिंग कन्फर्म!',
    'download_receipt': 'रसीद डाउनलोड करा',
    'proceed_to_gate': 'गेटवर जा'
  }
};

export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('parking-language');
    if (savedLanguage && translations[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (language: string) => {
    if (translations[language]) {
      setCurrentLanguage(language);
      localStorage.setItem('parking-language', language);
    }
  };

  const t = (key: string): string => {
    return translations[currentLanguage]?.[key] || translations['en'][key] || key;
  };

  return {
    currentLanguage,
    changeLanguage,
    t
  };
};