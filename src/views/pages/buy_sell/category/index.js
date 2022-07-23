import React, { useEffect, useState } from 'react'
import { Dropdown, Navbar } from 'flowbite-react';
import landingImage from '../../../../assets/img/bg/landing.png'
import { useLocalizationContext } from '../../../../context/LocalizationContext';
import { LANGUAGES } from '../../../../localization';
import { useUserContext } from '../../../../context/UserContext';
import { useToasts } from 'react-toast-notifications';
import { useNavigate } from 'react-router-dom';
import useGlobalState from "../../../../hooks/useGlobalState";
import { getModule1Contract } from '../../../../contracts';
import { Pagination, Table } from 'rsuite';

const PageBuyAndSellCategories = () => {
    const { lang, setLang, t } = useLocalizationContext();

    const { web3Provider, address } = useGlobalState();
    const {userInfo, loadingUserInfo} = useUserContext();
    const { addToast } = useToasts();
    const navigate = useNavigate()

    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(false);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);

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

    const handleChangeLimit = dataKey => {
        setPage(1);
        setLimit(dataKey);
    };

    const createCategory = () => {
        navigate('/buy_sell/category/create');
    }

    return (
        <div>
            <div className="page-content">
                {/* <UserInfo /> */}

                {userInfo && userInfo.activated &&
                    <div className="text-right mb-2">
                            <button className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-4 rounded ml-2" 
                            type="button"
                            onClick={createCategory}
                        >
                            {t('Create Category')}
                        </button>
                    </div>
                }
                
                <div>
                    <Table height={620} data={categories} loading={loading}>
                        <Table.Column width={100} align="center" fixed>
                            <Table.HeaderCell>{t('Id')}</Table.HeaderCell>
                            <Table.Cell>
                                {(rowData, rowIndex) => {
                                    return (
                                        <span>{rowIndex + 1}</span>
                                    )
                                }}
                            </Table.Cell>
                            
                        </Table.Column>

                        <Table.Column width={300} flexGrow={1}>
                            <Table.HeaderCell>{t('Name')}</Table.HeaderCell>
                            <Table.Cell dataKey="name" />
                        </Table.Column>

                    </Table>
                    <div style={{ padding: 20 }}>
                        <Pagination
                            prev
                            next
                            first
                            last
                            ellipsis
                            boundaryLinks
                            maxButtons={5}
                            size="xs"
                            layout={['total', '-', 'limit', '|', 'pager', 'skip']}
                            total={categories.length}
                            limitOptions={[10, 20]}
                            limit={limit}
                            activePage={page}
                            onChangePage={setPage}
                            onChangeLimit={handleChangeLimit}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PageBuyAndSellCategories