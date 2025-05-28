import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import '../styles/LanguageSidebar.css';

const LanguageSidebar = () => {
  const { language, changeLanguage, t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  
  const toggleSidebar = () => {
    setExpanded(!expanded);
  };
  
  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
  };
  
  const languages = [
    { code: 'en', name: t.languages.en },
    { code: 'es', name: t.languages.es },
    { code: 'fr', name: t.languages.fr },
    { code: 'de', name: t.languages.de }
  ];
  
  return (
    <div className={`language-sidebar ${expanded ? 'expanded' : 'collapsed'}`}>
      <div className="language-toggle" onClick={toggleSidebar}>
        {expanded ? '◀' : '▶'}
      </div>
      <div className="language-options">
        {languages.map((lang) => (
          <div
            key={lang.code}
            className={`language-option ${language === lang.code ? 'active' : ''}`}
            onClick={() => handleLanguageChange(lang.code)}
          >
            <span className="language-code">{lang.code.toUpperCase()}</span>
            <span className="language-name">{lang.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguageSidebar;
