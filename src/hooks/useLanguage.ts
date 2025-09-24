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
    'proceed_to_gate': 'Proceed to Gate',
    'full_name': 'Full Name',
    'contact_number': 'Contact Number',
    'email_address': 'Email Address',
    'vehicle_type': 'Vehicle Type',
    'vehicle_number': 'Vehicle Number',
    'continue': 'Continue',
    'back': 'Back',
    'next': 'Next',
    'pay_now': 'Pay Now',
    'processing': 'Processing...',
    'total_amount': 'Total Amount',
    'admin_overview': 'Real-time parking management overview',
    'select_best_plan': 'Select the plan that best suits your needs',
    'spots_available': 'spots available',
    'not_available': 'Not Available',
    'payment_successful': 'Payment Successful',
    'payment_charged': 'has been charged successfully!',
    'payment_failed': 'Payment Failed',
    'payment_error': 'Something went wrong. Please try again.',
    'complete_payment': 'Complete your booking payment',
    'payment_details_required': 'Payment Details Required',
    'fill_card_details': 'Please fill in all card details to proceed',
    'provide_upi_netbanking': 'Please provide UPI ID or select net banking'
  },
  hi: {
    'welcome': 'PARKVUE में आपका स्वागत है',
    'tagline': 'खोजें, बुक करें और आसानी से पपार्क करें',
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
    'proceed_to_gate': 'गेट पर जाएं',
    'full_name': 'पूरा नाम',
    'contact_number': 'संपर्क नंबर',
    'email_address': 'ईमेल पता',
    'vehicle_type': 'वाहन का प्रकार',
    'vehicle_number': 'वाहन नंबर',
    'continue': 'जारी रखें',
    'back': 'वापस',
    'next': 'अगला',
    'pay_now': 'अभी भुगतान करें',
    'processing': 'प्रसंस्करण...',
    'total_amount': 'कुल राशि',
    'admin_overview': 'रियल-टाइम पार्किंग प्रबंधन अवलोकन',
    'select_best_plan': 'वह योजना चुनें जो आपकी आवश्यकताओं के लिए सबसे उपयुक्त हो',
    'spots_available': 'स्पॉट उपलब्ध',
    'not_available': 'उपलब्ध नहीं',
    'payment_successful': 'भुगतान सफल',
    'payment_charged': 'सफलतापूर्वक चार्ज किया गया है!',
    'payment_failed': 'भुगतान असफल',
    'payment_error': 'कुछ गलत हुआ। कृपया पुनः प्रयास करें।',
    'complete_payment': 'अपना बुकिंग भुगतान पूरा करें',
    'payment_details_required': 'भुगतान विवरण आवश्यक',
    'fill_card_details': 'आगे बढ़ने के लिए कृपया सभी कार्ड विवरण भरें',
    'provide_upi_netbanking': 'कृपया UPI ID प्रदान करें या नेट बैंकिंग चुनें'
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
    'proceed_to_gate': 'गेटवर जा',
    'full_name': 'पूर्ण नाव',
    'contact_number': 'संपर्क क्रमांक',
    'email_address': 'ईमेल पत्ता',
    'vehicle_type': 'वाहनाचा प्रकार',
    'vehicle_number': 'वाहन क्रमांक',
    'continue': 'चालू ठेवा',
    'back': 'मागे',
    'next': 'पुढे',
    'pay_now': 'आता पैसे द्या',
    'processing': 'प्रक्रिया करत आहे...',
    'total_amount': 'एकूण रक्कम',
    'admin_overview': 'रिअल-टाइम पार्किंग व्यवस्थापन विहंगावलोकन',
    'select_best_plan': 'तुमच्या गरजांसाठी सर्वोत्तम योजना निवडा',
    'spots_available': 'स्पॉट उपलब्ध',
    'not_available': 'उपलब्ध नाही',
    'payment_successful': 'पेमेंट यशस्वी',
    'payment_charged': 'यशस्वीरित्या चार्ज केले आहे!',
    'payment_failed': 'पेमेंट अयशस्वी',
    'payment_error': 'काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.',
    'complete_payment': 'तुमचे बुकिंग पेमेंट पूर्ण करा',
    'payment_details_required': 'पेमेंट तपशील आवश्यक',
    'fill_card_details': 'पुढे जाण्यासाठी कृपया सर्व कार्ड तपशील भरा',
    'provide_upi_netbanking': 'कृपया UPI ID द्या किंवा नेट बँकिंग निवडा'
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