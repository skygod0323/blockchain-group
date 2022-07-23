import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { Pagination, Table } from "rsuite";
import UserInfo from "../../../components/UserInfo";
import WalletConnect from "../../../components/WalletConnect";
import { useUserContext } from "../../../context/UserContext";
import useGlobalState from "../../../hooks/useGlobalState";
import { FaRegWindowClose } from "react-icons/fa";
import { getModule1Contract } from "../../../contracts";
import { useLocalizationContext } from "../../../context/LocalizationContext";

const PageVotingMaterialDetail = () => {
    const {t} = useLocalizationContext()
    const { web3Provider, address } = useGlobalState();
    const {userInfo, setUserInfo} = useUserContext();
    const { addToast } = useToasts();
    const navigate = useNavigate()
    const { id } = useParams();

    const [loading, setLoading] = useState(false);
    const [votingMaterial, setVotingMaterial] = useState({});
    const [alreadyVote, setAlreadyVote] = useState(false);
    const [userVotings, setUserVotings] = useState([]);

    useEffect(() => {
        const getVotingMaterial = async () => {
            if (web3Provider && address) {
                setLoading(true);
                try {
                    const module1Contract = getModule1Contract(web3Provider.getSigner());
                    const _votingMateril = await module1Contract.getVotingMaterialByIndex(id);
                    const _votingOptions = await module1Contract.getAllVotingOptions();
                    const _userVotings = await module1Contract.getUserVotings(address)

                    setUserVotings(_userVotings.map(id => {
                        return id.toNumber();
                    }))

                    const optionIndexs = _votingMateril.options;
                    const options = optionIndexs.map(i => {
                        const index = i.toNumber();
                        return {
                            option: _votingOptions[index].option,
                            votedCount: _votingOptions[index].votedCount.toNumber()
                        }
                    });

                    const tmp = {
                        creator: _votingMateril.creator,
                        name: _votingMateril.name,
                        optionCount: _votingMateril.optionCount.toNumber(),
                        options: options
                    }

                    setVotingMaterial(tmp)

                    setLoading(false);
                } catch (error) {
                    setLoading(false);
                    addToast(t('Something went wrong'), {appearance: 'error', autoDismiss: true});
                    console.log(error);
                }
                
            }
        }
        getVotingMaterial();
    }, [web3Provider, address])

    useEffect(() => {
        if (userVotings.indexOf(Number(id)) > -1) {
            console.log('voted')
            setAlreadyVote(true);
        } else {
            setAlreadyVote(false);
        }
    }, [userVotings])

    const handleVote = async (index) => {
        if (!userInfo) {
            addToast(t('You need to join to Group'), {appearance: 'error', autoDismiss: true}); return;
        }

        if (!userInfo.activated) {
            addToast(t('You need to be activated by admin'), {appearance: 'error', autoDismiss: true}); return;
        }

        if (userInfo.addr == votingMaterial.creator) {
            addToast(t("You can't vote what you created"), {appearance: 'error', autoDismiss: true}); return;
        }

        try {
            const module1Contract = getModule1Contract(web3Provider.getSigner());
            const tx = await module1Contract.voteMaterial(id, index);
            const res = await tx.wait();

            addToast(t('You voted successfully'), {appearance: 'success', autoDismiss: true});

            setUserVotings(prevState => {
                return [...prevState, Number(id)]
            })

        } catch (error) {
            console.log(error);
            addToast(t('Something went wrong'), {appearance: 'error', autoDismiss: true});
        }
        

    }

    return web3Provider && address ?
        <div className="page-user-banner-create">
            <div className="rounded bg-white p-4">
                {loading ?
                    <>{t('Loading Voting Material...')}</>    
                    :
                    votingMaterial && <div>
                        {
                            alreadyVote && <div className="mb-3">
                                <div className="bg-green-100 border border-green-400 px-4 py-3 rounded relative" role="alert">
                                    <span className="text-green-700">{t('You already voted to this material.')}</span>
                                </div>
                            </div>
                        }
                        
                        <h1 className="text-xl font-bold mb-3">{votingMaterial.name}</h1>

                        <div>
                            <Table height={620} data={votingMaterial.options}>
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

                                <Table.Column width={100} fixed>
                                    <Table.HeaderCell>{t('Name')}</Table.HeaderCell>
                                    <Table.Cell dataKey="option" />
                                </Table.Column>

                                <Table.Column width={500} fixed>
                                    <Table.HeaderCell>{t('Voted Count')}</Table.HeaderCell>
                                    <Table.Cell dataKey="votedCount" />
                                </Table.Column>

                                {userInfo && userInfo.activated && !alreadyVote &&
                                <Table.Column width={100} flexGrow={1}>
                                    <Table.HeaderCell>{t('Action')}</Table.HeaderCell>

                                    <Table.Cell>
                                        { (rowData, index) =>
                                            <span className="cursor-pointer">
                                                <a onClick={() => handleVote(index)}> {t('Vote')} </a>
                                            </span>
                                        }
                                    </Table.Cell>
                                </Table.Column>}

                            </Table>
                            {/* <div style={{ padding: 20 }}>
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
                                    total={votingMateril.ption.length}
                                    limitOptions={[10, 20]}
                                    limit={limit}
                                    activePage={page}
                                    onChangePage={setPage}
                                    onChangeLimit={handleChangeLimit}
                                />
                            </div> */}
                        </div>
                    </div>
                }
            </div>
        </div>
        :
        <WalletConnect />
}

export default PageVotingMaterialDetail;