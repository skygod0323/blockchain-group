import React, { useEffect, useState } from 'react'
import { Dropdown, Navbar } from 'flowbite-react';
import landingImage from '../../../assets/img/bg/landing.png'
import { useLocalizationContext } from '../../../context/LocalizationContext';
import { LANGUAGES } from '../../../localization';

const PageCertificate = () => {
  const { lang, setLang, t } = useLocalizationContext();

  return (
    <div>Certificate Page. Coming Soon</div>
  )
}

export default PageCertificate