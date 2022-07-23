import { Cookies } from "react-cookie";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import routes from "../../../routes";
import Header from "./header";
import SideBar from "./sidebar";
import { useAppContext } from "../../../context/AppContext";
import useGlobalState from "../../../hooks/useGlobalState";
import WalletConnect from "../../../components/WalletConnect";

const MainLayout = () => {

    const { web3Provider, address } = useGlobalState();
    const [ cookies ] = useCookies();
    const navigate = useNavigate();
    const {sidebarToggled, setSidebarToggled} = useAppContext();
    
    const storedUserInfo = cookies.userInfo;

    // if (!storedUserInfo || storedUserInfo == 'false') {
    //     window.location.href = '/auth/login';
    // }

    const getRoutes = () => {
        return routes.map((prop, key) => {
            if (prop.layout == 'main_layout') {
                return <Route key={key} path={prop.path} element={prop.element} />
            } else {
                return null
            }
        });
    };

    const handleToggleSidebar = (toggle) => {
        setSidebarToggled(toggle);
    }

    return (
        <div className="dashboard">
            <SideBar toggled={sidebarToggled} handleToggleSidebar={handleToggleSidebar}/>
            <div className="main-wrapper w-full flex flex-col">
                <Header />
                <div className="main-content p-3 bg-slate-50 h-full">
                    { web3Provider && address ?
                    <Routes>
                        {getRoutes()}
                        <Route
                            path="*"
                            element={<Navigate to="/" />}
                        />
                    </Routes>
                    : 
                    <WalletConnect></WalletConnect>
                    }
                </div>
                
            </div>
            
        </div>
        
    )
}

export default MainLayout