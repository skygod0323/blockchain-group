import { ProSidebar, Menu, MenuItem, SubMenu, SidebarHeader, SidebarContent, SidebarFooter } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { FaTachometerAlt, FaGem, FaList, FaGithub, FaRegLaughWink, FaHeart, FaAdversal, FaBimobject, FaSignLanguage, FaShapes, FaCogs, FaSearch, FaUsers } from 'react-icons/fa';
import sidebarBg from '../../../assets/img/sidebar-bg.jpg';
import { Link } from 'react-router-dom';
import { useUserContext } from '../../../context/UserContext';
import { useLocalizationContext } from '../../../context/LocalizationContext';

const SideBar = ({ image, collapsed, rtl, toggled, handleToggleSidebar }) => {

    const {userInfo} = useUserContext();
    const {t} = useLocalizationContext()

    return (
        <ProSidebar
            image={image ? sidebarBg : false}
            rtl={rtl}
            collapsed={collapsed}
            toggled={toggled}
            breakPoint="md"
            onToggle={handleToggleSidebar}
            >
            <SidebarHeader>
                <div
                    style={{
                        padding: '24px',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        fontSize: 14,
                        letterSpacing: '1px',
                        // overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                >
                <Link to="/">Crypto</Link>
                
                </div>
            </SidebarHeader>

            <SidebarContent>
                <Menu iconShape="circle">
                    <MenuItem icon={<FaGem />}>{t('HOME')}<Link to="/" /></MenuItem>
                    <MenuItem icon={<FaUsers />}>{t('MEMBERS')}<Link to="/members" /></MenuItem>
                    <MenuItem icon={<FaGem />}>{t('E-VOTING')}<Link to="/voting_materials" /></MenuItem>
                    <MenuItem icon={<FaGem />}>{t('E-CERTIFICATE')}<Link to="/certificate" /></MenuItem>
                    <SubMenu
                        title={t('BUY AND SELL')}
                        icon={<FaGem/>}
                    >   
                        <MenuItem icon={<FaGem />}>{t('HOME')}<Link to="/buy_sell/home" /></MenuItem>    
                        <MenuItem icon={<FaGem />}>{t('CATEGORIES')}<Link to="/buy_sell/categories" /></MenuItem>
                        <MenuItem icon={<FaGem />}>{t('PRODUCTS')}<Link to="/buy_sell/products" /></MenuItem>
                        {/* <MenuItem icon={<FaGem />}>{t('ORDERS')}<Link to="/buy_sell/orders" /></MenuItem>     */}
                    </SubMenu>
                    <MenuItem icon={<FaGem />}>{t('RULE VERIFICATION')}<Link to="/" /></MenuItem>
                    <MenuItem icon={<FaGem />}>{t('EDUCATION')}<Link to="/" /></MenuItem>
                    <MenuItem icon={<FaGem />}>{t('SOCIAL CREDIT')}<Link to="/" /></MenuItem>
                    
                    {/* <SubMenu
                        title={'Search Bar'}
                        icon={<FaSearch />}
                    >
                        <MenuItem>Purchased List<Link to="/search_bar" /></MenuItem>
                        <MenuItem>Purchase<Link to="/search_bar/create" /></MenuItem>
                    </SubMenu> */}
                </Menu>
            </SidebarContent>

            <SidebarFooter style={{ textAlign: 'center' }}>
                
            </SidebarFooter>
        </ProSidebar>
    )
}

export default SideBar;

