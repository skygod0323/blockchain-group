import React, { useEffect, useState } from 'react'
import { Dropdown, Navbar } from 'flowbite-react';
import landingImage from '../../../assets/img/bg/landing.png'
import { useLocalizationContext } from '../../../context/LocalizationContext';
import { LANGUAGES } from '../../../localization';
import { Link } from 'react-router-dom';

const PageHome = () => {
  const { lang, setLang, t } = useLocalizationContext();
  return (
    <div className="w-full landing-page">
      <Navbar rounded={true}>
        <Navbar.Brand href="/">
          <span className="text-sky-500 text-xl font-bold cursor-pointer">
          Solusi Partai Bumi Putra
          </span>
          <Navbar.Toggle/>
        </Navbar.Brand>
        <Navbar.Collapse style={{ alignItems: 'center' }}>
          <Navbar.Link
            href="/navbars"
            active={true}
          >
            {t('HOME')}
          </Navbar.Link>
          <Dropdown arrowIcon inline label={t("SERVICES")}>
            <Dropdown.Item>
              <Link to="/voting_materials">{t('E-VOTING')}</Link>
            </Dropdown.Item>
            <Dropdown.Item>
              <Link to="/certificate">{t('E-CERTIFICATE')}</Link>
            </Dropdown.Item>
            <Dropdown.Item>
              <Link to="/buy_sell/home">{t('BUY AND SELL')}</Link>
            </Dropdown.Item>
            <Dropdown.Item>
              {t('RULE VERIFICATION')}
            </Dropdown.Item>
            <Dropdown.Item>
              {t('EDUCATION')}
            </Dropdown.Item>
            <Dropdown.Item>
              {t('SOCIAL CREDIT')}
            </Dropdown.Item>
          </Dropdown>
          <Navbar.Link href="/navbars">
            {t('ABOUTE')}
          </Navbar.Link>
          <Navbar.Link href="/navbars">
            {t('CONTACT')}
          </Navbar.Link>
          <Dropdown arrowIcon={false} inline label={LANGUAGES[lang]}>
            <Dropdown.Item onClick={() => setLang('in')}>
              INDONESIAN
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setLang('en')}>
              ENGLISH
            </Dropdown.Item>
          </Dropdown>
        </Navbar.Collapse>
      </Navbar>

      <div className='container py-4 mx-auto'>
        <div className='img-wrapper bg-black'>
          <div className='w-1/2 mx-auto'>
            <img src={landingImage} />
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default PageHome

