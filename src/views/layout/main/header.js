import { FaAlignJustify } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useAppContext } from "../../../context/AppContext";
import { deleteAllCookies, tokenAddress } from "../../../utils";
import { useUserContext } from "../../../context/UserContext";
import imgCredit from '../../../assets/img/icons/currency_dollar.png'
import ConnectWalletButton from "../../../components/ConnectWalletButton";
import useGlobalState from "../../../hooks/useGlobalState";

const Header = () => {

    const navigate = useNavigate();
    const {sidebarToggled, setSidebarToggled} = useAppContext();
    const { address } = useGlobalState();

    const toggleSidebar = () => {
        setSidebarToggled(!sidebarToggled);
    }

    return (
        <div className="header border-b">
            <div className="flex p-4 justify-between items-center">
                <div>
                    <div className="cursor-pointer btn-toggle" onClick={toggleSidebar}>
                        <FaAlignJustify className="text-xl"/>
                    </div>
                </div>
                
                <div className="">
                    
                    <span className="wallet mr-4">{address ? tokenAddress(address) : ''}</span>
                    <ConnectWalletButton />
                </div>
            </div>
        </div>
    )
}

export default Header;