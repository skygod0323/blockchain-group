import PageBuyAndSellHome from "../views/pages/buy_sell/home";
import PageBuyAndSellCategories from "../views/pages/buy_sell/category";
import PageBuyAndSellCreateCategory from "../views/pages/buy_sell/category/create";
import PageBuyAndSellProducts from "../views/pages/buy_sell/product";
import PageBuyAndSellCreateProduct from "../views/pages/buy_sell/product/create";
import PageCertificate from "../views/pages/certificate";
import PageBuyAndSellBuy from "../views/pages/buy_sell/buy";
import PageMembers from "../views/pages/members";
import PageVotingMaterials from "../views/pages/voting_materials";
import PageCreateVotingMaterial from "../views/pages/voting_materials/create";
import PageVotingMaterialDetail from "../views/pages/voting_materials/detail";

const routes = [
    {
        layout: 'main_layout',
        path: 'buy_sell/categories',
        element: <PageBuyAndSellCategories />
    },
    {
        layout: 'main_layout',
        path: 'buy_sell/category/create',
        element: <PageBuyAndSellCreateCategory />
    },

    {
        layout: 'main_layout',
        path: 'buy_sell/products',
        element: <PageBuyAndSellProducts />
    },
    {
        layout: 'main_layout',
        path: 'buy_sell/product/create',
        element: <PageBuyAndSellCreateProduct />
    },

    {
        layout: 'main_layout',
        path: 'buy_sell/home',
        element: <PageBuyAndSellHome />
    },

    {
        layout: 'main_layout',
        path: 'buy_sell/buy/:id',
        element: <PageBuyAndSellBuy />
    },

    {
        layout: 'main_layout',
        path: 'certificate',
        element: <PageCertificate />
    },

    {
        layout: 'main_layout',
        path: '/members',
        element: <PageMembers />
    },
  
    {
        layout: 'main_layout',
        path: 'voting_materials',
        element: <PageVotingMaterials />
    },
    {
        layout: 'main_layout',
        path: 'voting_materials/create',
        element: <PageCreateVotingMaterial />
    },

    {
        layout: 'main_layout',
        path: 'voting_materials/view/:id',
        element: <PageVotingMaterialDetail />
    },
]

export default routes;