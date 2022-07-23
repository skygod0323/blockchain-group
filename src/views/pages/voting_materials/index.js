import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { Pagination, Table } from "rsuite";
import UserInfo from "../../../components/UserInfo";
import WalletConnect from "../../../components/WalletConnect";
import { useLocalizationContext } from "../../../context/LocalizationContext";
import { useUserContext } from "../../../context/UserContext";
import { getModule1Contract } from "../../../contracts";
import useGlobalState from "../../../hooks/useGlobalState";

const PageVotingMaterials = () => {
    const {t} = useLocalizationContext()
    const { web3Provider, address } = useGlobalState();
    const {userInfo, loadingUserInfo} = useUserContext();
    const { addToast } = useToasts();
    const navigate = useNavigate()

    const [votingMaterils, setVotingMaterials] = useState([]);
    const [loading, setLoading] = useState(false);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const getMembers = async () => {
            if (web3Provider && address) {
                setLoading(true);
                try {
                    const module1Contract = getModule1Contract(web3Provider.getSigner());
                    const _votingMaterils = await module1Contract.getAllVotingMaterials();

                    setVotingMaterials(_votingMaterils.map(_material => {
                        return {
                            creator: _material.creator,
                            name: _material.name,
                            optionCount: _material.optionCount.toNumber()
                        }
                    }))

                    setLoading(false);
                } catch (error) {
                    setLoading(false);
                    addToast(t('Something went wrong'), {appearance: 'error', autoDismiss: true});
                }
                
            }
        }
        getMembers();
    }, [web3Provider, address])

    const handleChangeLimit = dataKey => {
        setPage(1);
        setLimit(dataKey);
    };

    const viewDetail = (index)  => {
        navigate('/voting_materials/view/' + index);
    }


    const createVotingMaterial = () => {
        navigate('/voting_materials/create');
    }


    return web3Provider && address ?
        <div>
            <div className="page-content">
                {/* <UserInfo /> */}

                {userInfo && userInfo.activated &&
                    <div className="text-right mb-2">
                         <button className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-4 rounded ml-2" 
                            type="button"
                            onClick={createVotingMaterial}
                        >
                            {t('Create Voting Material')}
                        </button>
                    </div>
                }
                
                <div>
                    <Table height={620} data={votingMaterils} loading={loading}>
                        <Table.Column width={50} align="center" fixed>
                            <Table.HeaderCell>{t('Id')}</Table.HeaderCell>
                            <Table.Cell>
                                {(rowData, rowIndex) => {
                                    return (
                                        <span>{rowIndex + 1}</span>
                                    )
                                }}
                            </Table.Cell>
                            
                        </Table.Column>

                        <Table.Column width={300} fixed>
                            <Table.HeaderCell>{t('Name')}</Table.HeaderCell>
                            <Table.Cell dataKey="name" />
                        </Table.Column>

                        <Table.Column width={300} fixed>
                            <Table.HeaderCell>{t('Creator')}</Table.HeaderCell>
                            <Table.Cell dataKey="creator" />
                        </Table.Column>

                        <Table.Column width={100} fixed>
                            <Table.HeaderCell>{t('Options Count')}</Table.HeaderCell>
                            <Table.Cell dataKey="optionCount" />
                        </Table.Column>

                        <Table.Column width={100} flexGrow={1}>
                            <Table.HeaderCell>{t('Action')}</Table.HeaderCell>

                            <Table.Cell>
                                { (rowData, index) =>
                                    <span className="cursor-pointer">
                                        <a onClick={() => viewDetail(index)}> {t('View Detail')} </a>
                                    </span>
                                }
                            </Table.Cell>
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
                            total={votingMaterils.length}
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


        :
        <WalletConnect />
}

export default PageVotingMaterials;