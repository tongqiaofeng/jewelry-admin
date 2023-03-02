// 其他管理模块
import { get, post } from "../http";

// 删除活动
export const activityDelPort = (p) => get("/activityDel", p);

// 活动添加/修改
export const activitySavePort = (p) => post("/activitySave", p);

// 获取活动列表
export const activityListPort = (p) => post("/activityList", p);

// 删除系列
export const seriesDelPort = (p) => get("/seriesDel", p);

// 添加/修改系列
export const seriesSavePort = (p) => post("/seriesSave", p);

// 分类图片修改
export const productTypeImgPort = (p) => post("/productTypeImgSave", p);

// 获取分类图片
export const productTypeImgListPort = () => get("/productTypeImgList");

// 删除优惠券
export const couponDelPort = (p) => get("/couponDelete", p);

// 添加/修改优惠券
export const couponSavePort = (p) => post("/couponSave", p);

// 获取优惠券列表
export const couponListPort = (p) => post("/couponList", p);

// 专属定制图片修改
export const customerDesignPort = (p) => post("/customerDesignSave", p);

// 获取专属定制图片
export const customerDesignListPort = () => get("/customerDesignList");

// 主推产品管理
export const recommendProductPort = (p) => post("/recommendProductSave", p);

// 主推产品列表
export const recommendProductListPort = () => get("/recommendProductList");

// 上新产品管理
export const newStylePort = (p) => post("/newStyleSave", p);

// 上线产品列表
export const newStyleProductListPort = () => get("/newStyleProductList");

// 获取设计图列表
export const designDrawListPort = () => get("/designDrawListGet");

// 修改设计图
export const producibleDesignSavePort = (p) => post("/producibleDesignSave", p);

// 获取设计图标签列表
export const designLabelListPort = () => get("/designLabelListGet");
