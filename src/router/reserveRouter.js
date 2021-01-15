//景点
import Attractions from "@/views/reserveManager/attractions/attractions.vue"
import AttractionsList from "@/views/reserveManager/attractions/list.vue"
import AddOrEditAttractions from "@/views/reserveManager/attractions/addOrEdit.vue"

//線路
import Periphery from "@/views/reserveManager/peripheryTravel/peripheryTravel.vue"
import PeripheryList from "@/views/reserveManager/peripheryTravel/peripheryList.vue"
import AddPeriphery from "@/views/reserveManager/peripheryTravel/addPeriphery.vue"
import EditPeriphery from "@/views/reserveManager/peripheryTravel/editPeriphery.vue"

//产品
import Product from "@/views/reserveManager/product/product.vue"
import ProductList from "@/views/reserveManager/product/productList.vue"
import AddProduct from "@/views/reserveManager/product/addProduct.vue"
import EditProduct from "@/views/reserveManager/product/editProduct.vue"
//产品分类
import ProductClassList from "@/views/reserveManager/product/productClassList.vue"
import AddProductClass from "@/views/reserveManager/product/addProductClass.vue"
import EditProductClass from "@/views/reserveManager/product/editProductClass.vue"

let router = [{
    path: "/attractions",
    name: "attractions",
    component: Attractions,
    meta: {
        title: "景点管理",
        icon: "el-icon-s-home",
        code: ["5001000"]
    },
    children: [{
        path: "/attractionsList",
        name: "attractionsList",
        component: AttractionsList,
        meta: {
            title: "景点列表",
            icon: "el-icon-s-home",
            parentName: "景点管理",
            code: ["5001001"]
        }
    },
    {
        path: "/addOrEditAttractions",
        name: "addOrEditAttractions",
        component: AddOrEditAttractions,
        meta: {
            title: "编辑景点",
            icon: "el-icon-s-home",
            parentName: "景点管理",
            code: ["5001002", "5001003"]
        }
    }
    ]
}, {
    path: "/periphery",
    name: "periphery",
    component: Periphery,
    meta: {
        title: "线路管理",
        icon: "el-icon-s-home",
        code: ["5003000"]
    },
    children: [{
        path: "/travel/periphery/list",
        name: "peripheryList",
        component: PeripheryList,
        meta: {
            title: "线路列表",
            icon: "el-icon-s-home",
            parentName: "线路管理",
            code: ["5003001"]
        }
    },
    {
        path: "/travel/periphery/add",
        name: "addPeriphery",
        component: AddPeriphery,
        meta: {
            title: "添加线路",
            icon: "el-icon-s-home",
            parentName: "线路管理",
            code: ["5003002"]
        }
    },
    {
        path: "//travel/periphery/edit",
        name: "editPeriphery",
        component: EditPeriphery,
        meta: {
            title: "编辑线路",
            icon: "el-icon-s-home",
            parentName: "线路管理",
            code: ["5003003"],
            show: false,
        }
    }]
},{
    path: "/product",
    name: "product",
    component: Product,
    meta: {
        title: "产品管理",
        icon: "el-icon-s-home",
        code: ["5004000"]
    },
    children: [{
        path: "/productClassList",
        name: "productClassList",
        component: ProductClassList,
        meta: {
            title: "产品分类列表",
            icon: "el-icon-s-home",
            parentName: "产品管理",
            code: ["5004001"]
        }
    },
    {
        path: "/addProductClass",
        name: "addProductClass",
        component: AddProductClass,
        meta: {
            title: "添加产品分类",
            icon: "el-icon-s-home",
            parentName: "产品管理",
            code: ["5004002"]
        }
    },
    {
        path: "/editProductClass",
        name: "editProductClass",
        component: EditProductClass,
        meta: {
            title: "编辑产品分类",
            icon: "el-icon-s-home",
            parentName: "产品管理",
            code: ["5004003"],
            show: false,
        }
    },{
        path: "/productList",
        name: "productList",
        component: ProductList,
        meta: {
            title: "产品列表",
            icon: "el-icon-s-home",
            parentName: "产品管理",
            code: ["5004011"],
        }
    },{
        path: "/addProduct",
        name: "addProduct",
        component: AddProduct,
        meta: {
            title: "添加产品",
            icon: "el-icon-s-home",
            parentName: "产品管理",
            code: ["5004012"],
        }
    },{
        path: "/editProduct",
        name: "editProduct",
        component: EditProduct,
        meta: {
            title: "编辑产品",
            icon: "el-icon-s-home",
            parentName: "产品管理",
            code: ["5004013"],
            show: false,
        }
    }]
}]
export default router;