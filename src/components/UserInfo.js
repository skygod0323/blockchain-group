import { useState } from "react";
import { useToasts } from "react-toast-notifications";
import { useLocalizationContext } from "../context/LocalizationContext";
import { useUserContext } from "../context/UserContext";
import { getMemberContract } from "../contracts";
import useGlobalState from "../hooks/useGlobalState";

const UserInfo = () => {
    const {userInfo, setUserInfo, loadingUserInfo, setLoadingUserInfo} = useUserContext();
    const { addToast } = useToasts();
    const { web3Provider, address } = useGlobalState();
    const {t} = useLocalizationContext()

    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleNameChange = (param) => {
        setName(param);
    };

    const handleJoin = async () => {
        if (name == '') {
            addToast(t('Please enter your name'), {appearance: 'error', autoDismiss: true});
            return;
        }

        if (!web3Provider) {
            addToast(t('Check your wallet connection'), {appearance: 'error', autoDismiss: true});
            return;
        }

        setLoading(true);
        try {
            const memberContract = getMemberContract(web3Provider.getSigner());    
            const tx = await memberContract.joinToGroup(name);
            const res = await tx.wait();
            
            if (res) {
                addToast(t('You successfully joined'), {appearance: 'success', autoDismiss: true});
                setLoadingUserInfo(true);
                try {
                    const isJoined = await memberContract.checkJoined(address);
                    const member_res = await memberContract.getMemberByAddress(address);
                    const isAdmin = await memberContract.isAuthorized(address);

                    //// check join status
                    if (isJoined) {
                        const _userInfo = {
                            addr: member_res.addr,
                            name: member_res.name,
                            joined: true,
                            activated: member_res.activated,
                            isAdmin
                        }

                        setUserInfo(_userInfo);
                        setLoadingUserInfo(false);
                    } else {
                        setUserInfo(false);
                        setLoadingUserInfo(false);
                    }
                } catch {
                    addToast(t(t('Something went wrong')), {appearance: 'error', autoDismiss: true});
                }
            }
            setLoading(false);

        } catch (error) {
            console.log(error);
            addToast(t(t('Something went wrong')), {appearance: 'error', autoDismiss: true});
            setLoading(false);
        }

    }

    return (
        <>
            {   
                loadingUserInfo ? 
                <div className="mb-3">
                    <svg className="inline-block animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="align-middle">{t('Loading your info...')}</span>
                </div>
                :
                ( userInfo  ?
                    <div className="mb-3">
                        {t('Your name') + ': ' + userInfo.name}
                    </div>
                    :
                    <div className='mb-3'>
                        <div className="bg-red-100 border border-red-400 px-4 py-3 rounded relative" role="alert">
                            <span className="text-red-700">{t('You need to join to group to use this system.')}</span>
                        </div>

                        <div className="mt-3">
                            <form className="w-full max-w-sm">
                                <div className="flex items-center">
                                    <input className="appearance-none block w-full text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight bg-white focus:outline-none" 
                                        type="text" placeholder="Your Name" 
                                        value={name}
                                        onChange={e => handleNameChange(e.target.value)} 
                                    />
                                    <button className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-4 rounded ml-2" 
                                        type="button"
                                        onClick={handleJoin}
                                    >
                                        {t('Join')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default UserInfo;