
import { useCallback, useEffect, useState } from 'react';
import useGlobalState from '../../../hooks/useGlobalState';
import { Contract } from 'ethers';
import { useUserContext } from '../../../context/UserContext';
import WalletConnect from '../../../components/WalletConnect';
import { useToasts } from 'react-toast-notifications';
import { Pagination, Table } from 'rsuite';
import UserInfo from '../../../components/UserInfo';
import { getMemberContract } from '../../../contracts';
import { useLocalizationContext } from '../../../context/LocalizationContext';

const PageMembers = () => {
    const {t} = useLocalizationContext()
    const { web3Provider, address } = useGlobalState();
    const {userInfo, loadingUserInfo} = useUserContext();
    const { addToast } = useToasts();

    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);

    useEffect(() => {
        getMembers();
    }, [])

    useEffect(() => {
        getMembers();
    }, [web3Provider, address, userInfo])

    const getMembers = async () => {
        if (web3Provider && address) {
            setLoading(true);
            try {
                const memberContract = getMemberContract(web3Provider.getSigner());
                const res = await memberContract.getAllMembers();

                setMembers(res.map(_member => {
                    return {
                        'addr': _member[0],
                        'name': _member[1],
                        'activated': _member[2],
                    }
                }))

                setLoading(false);
            } catch (error) {
                setLoading(false);
                addToast(t('Something went wrong'), {appearance: 'error', autoDismiss: true});
            }
            
        }
    }

    const handleChangeLimit = dataKey => {
        setPage(1);
        setLimit(dataKey);
    };

    const handleActivate = async (index) =>  {
        try {
            const memberContract = getMemberContract(web3Provider.getSigner());
            const tx = await memberContract.activateMember([index]);
            const res = await tx.wait();

            if (res) {
                addToast(t('You activated the member.'), {appearance: 'success', autoDismiss: true});    
                members[index].activated = true;
                setMembers(members);
            }
        } catch {
            addToast(t('Something went wrong'), {appearance: 'error', autoDismiss: true});
        }
        

    }



    return web3Provider && address ?
        <div>
            <div className="page-content">
                <UserInfo />
                <div>
                    <Table height={620} data={members} loading={loading}>
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

                        <Table.Column width={200} fixed>
                            <Table.HeaderCell>{t('Name')}</Table.HeaderCell>
                            <Table.Cell>
                                {(rowData) => {
                                    const isYou = address == rowData.addr;
                                    return (
                                        <span>{rowData.name} {isYou ? ' (YOU)' : ''}</span>
                                    )
                                }}
                            </Table.Cell>
                            {/* <Table.Cell dataKey="name" /> */}
                        </Table.Column>

                        <Table.Column width={500} fixed>
                            <Table.HeaderCell>{t('Wallet Address')}</Table.HeaderCell>
                            <Table.Cell dataKey="addr" />
                        </Table.Column>

                        <Table.Column width={100} flexGrow={1}>
                            <Table.HeaderCell>{t('Status')}</Table.HeaderCell>
                            <Table.Cell>
                                {(rowData) => { 
                                    return rowData.activated ?
                                        <span>{t('Active')}</span> : <span>{t('Inactive')}</span>
                                }}
                            </Table.Cell>
                        </Table.Column>

                        { userInfo && userInfo.isAdmin &&
                        <Table.Column width={100} flexGrow={1}>
                            <Table.HeaderCell>{t('Action')}</Table.HeaderCell>

                            <Table.Cell>
                                { (rowData, rowIndex) =>
                                    !rowData.activated ?
                                    <span>
                                        <a onClick={() => handleActivate(rowIndex)}> {t('Activate')} </a>
                                    </span>
                                    :
                                    <></>
                                }
                            </Table.Cell>
                        </Table.Column>}

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
                            total={members.length}
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

export default PageMembers;