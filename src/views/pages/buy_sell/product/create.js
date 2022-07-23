import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useToasts } from "react-toast-notifications";
import { useLocalizationContext } from '../../../../context/LocalizationContext';
import { LANGUAGES } from '../../../../localization';
import useGlobalState from '../../../../hooks/useGlobalState';
import { useUserContext } from '../../../../context/UserContext';
import { getModule1Contract } from '../../../../contracts';
import { uploadFileToS3 } from '../../../../utils/aws';


const PageBuyAndSellCreateProduct = () => {
    const { lang, setLang, t } = useLocalizationContext();
    const { web3Provider, address } = useGlobalState();
    const {userInfo, loadingUserInfo} = useUserContext();
    const fileInput = useRef(null);
    const { addToast } = useToasts();
    const navigate = useNavigate()

    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(false);
    const [fileUploading, setFileUploading] = useState(false);

    const [values, setValues] = useState({
        category: '',
        name: '',
        image: '',
    });

    const [validations, setValidations] = useState({
        category: '',
        name: '',
        image: '',
    })

    const checkvalidations = () => {
        if (values.category === '') {
            setValidations({ category: 'has-empty', name: '', image: ''});
            return false;
        } else if (values.name === '') {
            setValidations({ category: '', name: 'has-empty', image: ''});
            return false;
        } else if (values.image === '') {
            setValidations({ category: '', name: '', image: 'has-empty'});
            return false;
        } else {
            setValidations({ category: '', name: '', image: ''});
        }
    
        return true;
    };

    const handleChange = (prop, value) => {
        setValidations(prevState => ({ ...prevState, [prop]: '' }));
        setValues({ ...values, [prop]: value });
    };

    useEffect(() => {
        const getCategories = async () => {
            if (web3Provider && address) {
                setLoading(true);
                try {
                    const module1Contract = getModule1Contract(web3Provider.getSigner());
                    const _categories = await module1Contract.getAllCategories();

                    setCategories(_categories);
                    setLoading(false);
                } catch (error) {
                    setLoading(false);
                    addToast(t('Something went wrong'), {appearance: 'error', autoDismiss: true});
                }
                
            }
        }
        getCategories();
    }, [web3Provider, address])

    const handleUploadImage = () => {
        fileInput.current.click();
    }

    const imageChange = (e) => {
        const file = e.target.files[0];

        setFileUploading(true);

        uploadFileToS3(file)
            .then(data => {
                setValues({ ...values, image: data });
                setFileUploading(false);
            })
            .catch(error => {
                console.error(error);
                setFileUploading(false);
                addToast(t('File upload failed'), {appearance: 'error', autoDismiss: true});
            })
        
    }

    const handleCreate = async () => {

        if (!checkvalidations()) return;

        try {
            setLoading(true);
            const module1Contract = getModule1Contract(web3Provider.getSigner());
            const tx = await module1Contract.createProduct(values.name, values.image, values.category);
            const res = await tx.wait();

            addToast(t('You created a product successfully'), {appearance: 'success', autoDismiss: true});

            setValues({
                category: '',
                name: '',
                image: '',
            });
            
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
                <h1 className="text-xl font-bold">{t('Add Prodcut')}</h1>

                <div className="create-form">
                    <form className="bg-white rounded px-8 pt-6 pb-8 mb-4">

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                {t('Select Category')}
                            </label>
                            <select className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                                value={values.category}
                                onChange={e => handleChange('category', e.target.value)} 
                            >
                                <option value="">{t('Choose Category...')}</option>
                                {categories.map((category, index) => {
                                    return (
                                        <option value={index}>{category.name}</option>
                                    )
                                })}
                            </select>

                            { validations.category && <p className="text-red-500 text-xs italic">{t('Please choose a category.')}</p> }
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                {t('Product Name')}
                            </label>
                            <input className="shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                type="text" placeholder="" 
                                value={values.name}
                                onChange={e => handleChange('name', e.target.value)}    
                            />

                            { validations.name && <p className="text-red-500 text-xs italic">{t('Please put a product name.')}</p> }

                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                {t('Product Image')}
                            </label>
                            <input className="shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
                                type="text" placeholder="" 
                                value={values.image}
                                readonly
                                disabled
                            />
                            <input id="sign__file-upload" name="file"
                                accept=".png,.jpg,.jpeg" type="file"
                                onChange={imageChange}
                                ref={fileInput}
                                className="hidden" />

                            { validations.image && <p className="text-red-500 text-xs italic">{t('Please upload a product image.')}</p> }


                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-2" 
                                type="button" onClick={handleUploadImage}
                                disabled={fileUploading} 
                            >
                                {fileUploading ?
                                    <svg className="inline-block animate-spin -ml-1 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    :
                                    <>{t('Upload Image')}</>
                                }
                            </button>
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

export default PageBuyAndSellCreateProduct