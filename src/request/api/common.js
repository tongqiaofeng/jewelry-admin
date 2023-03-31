// 公共功能模块相关接口
import { get, post } from "../http";

// 成品库存查询
export const productListPort = (p) => post("/productList", p);

// 推荐搭配-获取成品列表
export const productRecommendPort = (p) => get("/collocationSearch", p);

// 获取成品详细信息
export const productInfoPort = (p) => post("/productInfo", p);

// 获取成品中原材料详情
export const stockMaterialInfoPort = (p) => post("/stockMaterialInfo", p);

// 修改成品信息
export const productSavePort = (p) => post("/productSave", p);

// 获取成品标签列表
export const tagListPort = () => get("/tagList");

// 获取品牌系列、联名系列列表
export const seriesListPort = () => get("/seriesList");

// 获取设计稿列表
export const designListPort = (p) => get("/producibleDesignList", p);

// 原材料库存查询
export const stockMaterialPort = (p) => post("/stockMaterialList", p);

// 修改原材料信息
export const materialSavePort = (p) => post("/materialSave", p);

// 获取原材料名称列表
export const materialListPort = () => post("/materialList");

// 获取仓库/加工厂列表
export const warehouseFactoryPort = (p) => post("/warehouseFactoryList", p);

// 获取顾客类型列表
export const customerTypeListPort = () => get("/customerTypeListGet ");

// 上传图片
export const uploadPort = (p) => post("/file/upload", p, true);

// 获取销售单详情
export const sellOrderGetPort = (p) => get("/sellOrderGet", p);

// 修改销售单详情
export const sellOrderSavePort = (p) => post("/sellOrderSave", p);

// 网页设置
export const webConfigSavePort = (p) => post("/webConfigSave", p);

// 获取网页设置
export const webConfigListPort = (p) => post("/webConfigList", p);

// 修改排序
export const webConfigSortPort = (p) => post("/webConfigSortSave", p);

// 删除
export const webConfigDelPort = (p) => get("/webConfigDel", p);
