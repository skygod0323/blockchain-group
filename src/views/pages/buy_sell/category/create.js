import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useToasts } from "react-toast-notifications";
import { useLocalizationContext } from '../../../../context/LocalizationContext';
import { LANGUAGES } from '../../../../localization';
import useGlobalState from '../../../../hooks/useGlobalState';
import { useUserContext } from '../../../../context/UserContext';
import { getModule1Contract } from '../../../../contracts';


const PageBuyAndSellCreateCategory = () => {
    const { lang, setLang, t } = useLocalizationContext();
    const { web3Provider, address } = useGlobalState();
    const {userInfo, loadingUserInfo} = useUserContext();
    const { addToast } = useToasts();
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false);

    const [name, setName] = useState('');


    const handleNameChange = (param) => {
        setName(param);
    }

    const handleCreate = async () => {
        if (name == '') {
            addToast(t('Please input category name'), {appearance: 'error', autoDismiss: true}); return;
        }

        try {
            setLoading(true);
            const module1Contract = getModule1Contract(web3Provider.getSigner());
            const tx = await module1Contract.createCategory(name);
            const res = await tx.wait();

            addToast(t('You created a category successfully'), {appearance: 'success', autoDismiss: true});

            setName('');
            
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
            addToast(t(t('Something went wrong')), {appearance: 'error', autoDismiss: true});
        }
    }

  return (
    <div className="page-user-banner-create">
            <div className="rounded bg-white p-4">
                <h1 className="text-xl font-bold">{t('Create Category')}</h1>

                <div className="create-form">
                    <form className="bg-white rounded px-8 pt-6 pb-8 mb-4">
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                {t('Category Name')}
                            </label>
                            <input className="shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                type="text" placeholder="" 
                                value={name}
                                onChange={e => handleNameChange(e.target.value)}    
                            />

                        </div>
                        
                        { userInfo && userInfo.activated &&
                        <div className="text-right mt-3">
                            <button className="w-20 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                                type="button" onClick={handleCreate}
                                disabled={loading} 
                            >
                                {loading ?
                                    <svg className="inline-block animate-spin -ml-1 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    :
                                    <>{t('Create')}</>
                                }
                            </button>
                        </div>
                        }
                    </form>
                </div>
            </div>
        </div>
  )
}

export default PageBuyAndSellCreateCategory