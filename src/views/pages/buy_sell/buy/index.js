import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useToasts } from "react-toast-notifications";
import { useLocalizationContext } from '../../../../context/LocalizationContext';
import { LANGUAGES } from '../../../../localization';
import useGlobalState from '../../../../hooks/useGlobalState';
import { useUserContext } from '../../../../context/UserContext';
import { getModule1Contract } from '../../../../contracts';
import { uploadFileToS3 } from '../../../../utils/aws';


const PageBuyAndSellBuy = () => {
    const { lang, setLang, t } = useLocalizationContext();
    const { web3Provider, address } = useGlobalState();
    const {userInfo, loadingUserInfo} = useUserContext();
    const fileInput = useRef(null);
    const { addToast } = useToasts();
    const navigate = useNavigate()

    const { id } = useParams();

    const [product, setProduct] = useState({});

    const [loading, setLoading] = useState(false);

    const [description, setDescription] = useState('');

    const handleDescriptionChange = (value) => {
        setDescription(value);
    }

    useEffect(() => {
        const getData = async () => {
            if (web3Provider && address) {
                setLoading(true);
                try {
                    const module1Contract = getModule1Contract(web3Provider.getSigner());
                    const _product = await module1Contract.getProductByIndex(id);

                    setProduct({
                        name: _product.name,
                        image: _product.imgUrl,
                        category: _product.category.toNumber()
                    });

                    
                    setLoading(false);
                } catch (error) {
                    setLoading(false);
                    addToast(t('Something went wrong'), {appearance: 'error', autoDismiss: true});
                }
                
            }
        }
        getData();
    }, [web3Provider, address])


    const handleBuy = async () => {

        if (description === '') {
            addToast(t('Please input description.'), {appearance: 'error', autoDismiss: true}); return;
        }

        try {
            setLoading(true);
            const module1Contract = getModule1Contract(web3Provider.getSigner());
            const tx = await module1Contract.createBuyOrder(id, description);
            const res = await tx.wait();

            addToast(t('You bought a product successfully'), {appearance: 'success', autoDismiss: true});

            navigate('/buy_sell/home');
            
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
                <h1 className="text-xl font-bold">{t('Buy Product')}</h1>

                <div className="create-form">
                    <form className="bg-white rounded px-8 pt-6 pb-8 mb-4">

                        <div class="grid grid-cols-3 gap-4"> 
                            <div className='col-span-1'>
                                <div className="product rounded-lg overflow-hidden">
                                    <div className="image-wrapper">
                                        <div className="inner">
                                            <img src={product.image} />
                                        </div>
                                    </div>

                                    <div className='summary p-3'>
                                        <p className="product-name text-xl">{product.name}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='col-span-2'>
                                <div className="">
                                    <textarea className="h-40 shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        type="text" placeholder={t('Description')} 
                                        
                                        onChange={e => handleDescriptionChange(e.target.value)}    
                                    >{description}</textarea>

                                </div>
                            </div>
                        </div>         

                        

                        
                        { userInfo && userInfo.activated &&
                        <div className="text-right mt-3">
                            <button className="w-20 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                                type="button" onClick={handleBuy}
                                disabled={loading} 
                            >
                                {loading ?
                                    <svg className="inline-block animate-spin -ml-1 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    :
                                    <>{t('Buy')}</>
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

export default PageBuyAndSellBuy