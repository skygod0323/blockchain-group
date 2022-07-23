import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { Pagination, Table } from "rsuite";
import UserInfo from "../../../components/UserInfo";
import WalletConnect from "../../../components/WalletConnect";
import { useUserContext } from "../../../context/UserContext";
import useGlobalState from "../../../hooks/useGlobalState";
import { FaRegWindowClose } from "react-icons/fa";
import { getModule1Contract } from "../../../contracts";
import { useLocalizationContext } from "../../../context/LocalizationContext";

const PageCreateVotingMaterial = () => {
    const {t} = useLocalizationContext()
    const { web3Provider, address } = useGlobalState();
    const {userInfo, loadingUserInfo} = useUserContext();
    const { addToast } = useToasts();
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false);

    const [name, setName] = useState('');
    const [option, setOption] = useState('')
    const [options, setOptions] = useState([]);

    const handleNameChange = (param) => {
        setName(param);
    }

    const handleOptionChange = (param) => {
        setOption(param);
    }

    const handleAddOption = () => {
        if (option == '') {
            addToast(t('Please input option name'), {appearance: 'error', autoDismiss: true});
            return;
        }

        setOptions(prevState => [...prevState, option]);
        setOption('');
    }

    const removeOption = (index) => {
        setOptions(prevState => [...prevState.slice(0, index), ...prevState.slice(index + 1)]);
    }

    const handleCreate = async () => {
        if (name == '') {
            addToast(t('Please input material name'), {appearance: 'error', autoDismiss: true}); return;
        }
        if (options.length == 0) {
            addToast(t('At least 1 option needed'), {appearance: 'error', autoDismiss: true}); return;
        }

        try {
            setLoading(true);
            const module1Contract = getModule1Contract(web3Provider.getSigner());
            const tx = await module1Contract.createVotingMaterial(name, options);
            const res = await tx.wait();

            addToast(t('You created a voting material successfully'), {appearance: 'success', autoDismiss: true});

            setName('');
            setOptions([]);
            
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
            addToast(t('Something went wrong'), {appearance: 'error', autoDismiss: true});
        }
    }

    return web3Provider && address ?
        <div className="page-user-banner-create">
            <div className="rounded bg-white p-4">
                <h1 className="text-xl font-bold">{t('Create Voting Material')}</h1>

                <div className="create-form">
                    <form className="bg-white rounded px-8 pt-6 pb-8 mb-4">
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                {t('Name')}
                            </label>
                            <input className="shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                type="text" placeholder="" 
                                value={name}
                                onChange={e => handleNameChange(e.target.value)}    
                            />

                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                {t('Options')}
                            </label>

                            {options.length == 0 ?
                                <div>{t('No options')}</div>
                                :
                                <div>
                                    <ul className="list-decimal pl-4">
                                        {
                                            options.map((option, index) => {
                                                return <li key={index} className="text-md mb-2">
                                                    <span>{option} </span>
                                                    <span className="align-middle inline-block ml-3" 
                                                        onClick={() => removeOption(index)}
                                                    >
                                                        <FaRegWindowClose />
                                                    </span>
                                                </li>
                                            })
                                        }
                                    </ul>
                                </div>
                            }



                        </div>

                        <div className="flex items-center">
                            <input className="appearance-none block w-full text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight bg-white focus:outline-none" 
                                type="text" placeholder={t("Option Name")}
                                value={option}
                                onChange={e => handleOptionChange(e.target.value)} 
                            />
                            <button className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-4 rounded ml-2" 
                                type="button"
                                onClick={handleAddOption}
                            >
                                {t('Add Option')}
                            </button>
                        </div>

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
                    </form>
                </div>
            </div>
        </div>
        :
        <WalletConnect />
    
}

export default PageCreateVotingMaterial;