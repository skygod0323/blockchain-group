import React, { useEffect, useState } from 'react'
import { Dropdown, Navbar } from 'flowbite-react';
import CheckPicker from 'rsuite/CheckPicker';
import landingImage from '../../../../assets/img/bg/landing.png'
import { useLocalizationContext } from '../../../../context/LocalizationContext';
import { LANGUAGES } from '../../../../localization';
import useGlobalState from '../../../../hooks/useGlobalState';
import { useUserContext } from '../../../../context/UserContext';
import { useToasts } from 'react-toast-notifications';
import { useNavigate } from 'react-router-dom';
import { getModule1Contract } from '../../../../contracts';

const PageBuyAndSellHome = () => {
    const { lang, setLang, t } = useLocalizationContext();

    const { web3Provider, address } = useGlobalState();
    const {userInfo, loadingUserInfo} = useUserContext();
    const { addToast } = useToasts();
    const navigate = useNavigate()

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([])

    const [selectedCategories, setSelectedCategories] = useState([]);

    const [loading, setLoading] = useState(false);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const getData = async () => {
            if (web3Provider && address) {
                setLoading(true);
                try {
                    const module1Contract = getModule1Contract(web3Provider.getSigner());
                    const _categories = await module1Contract.getAllCategories();
                    const _products = await module1Contract.getAllProducts();

                    setCategories(_categories.map((category, index) => {
                        return {label: category.name, value: index}
                    }));

                    setProducts(_products.map(product => {
                        return {
                            name: product.name,
                            image: product.imgUrl,
                            category: product.category.toNumber()
                        }
                    }));

                    
                    setLoading(false);
                } catch (error) {
                    setLoading(false);
                    addToast(t('Something went wrong'), {appearance: 'error', autoDismiss: true});
                }
                
            }
        }
        getData();
    }, [web3Provider, address])

    useEffect(() => {
        if (selectedCategories.length == 0) {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(products.filter(product => {
                return selectedCategories.includes(product.category);
            }))
        }
    }, [categories, products, selectedCategories])

    const handleCategoryChange = (e) => {
        setSelectedCategories(e);
    }

    const goToBuy = (index) => {
        navigate('/buy_sell/buy/' + index);
    }


    return (
        <div className='page-content'>
            <div className='p-3'>
                <div className='category-warpper mb-4'>
                    <h4 className='mb-2'>{t('Categories')}</h4>
                    <CheckPicker data={categories} block onChange={e => handleCategoryChange(e)}/>
                </div>
                
                <div className='products-wrapper'>
                    <h4 className='mb-2'>{t('All Products')}</h4>

                    <div class="grid grid-cols-4 gap-4">
                        {filteredProducts.map((product, index) => {
                            return (
                                <div key={index} className="product rounded-lg overflow-hidden">
                                    <div className="image-wrapper">
                                        <div className="inner">
                                            <img src={product.image} />
                                        </div>
                                    </div>

                                    <div className='summary p-3'>
                                        <p className="product-name text-xl">{product.name}</p>
                                        <div className='text-right mt-2'>
                                            <button className="w-20 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                                                    type="button" onClick={() => goToBuy(index)}
                                                    disabled={loading} 
                                                >
                                                
                                                    <>{t('Buy')}</>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PageBuyAndSellHome