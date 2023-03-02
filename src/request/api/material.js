// 仅原材料模块使用
import { get, post } from "../http";

// 原材料出库
export const materialOutDoPort = (p) => post("/materialOutDo", p);

// 删除原材料
export const materialDeletePort = (p) => get("/stockMaterialDel", p);

// 根据发票号删除采购记录
export const materialBuyOrderDelPort = (p) => get("/materialBuyOrderDel", p);

// 获取原材料有产品仓库
export const warehouseStockPort = (p) => post("/warehouseStockTotalGet", p);

// 获取采购记录列表
export const materialBuyOrderPort = (p) => post("/materialBuyOrderList", p);

// 获取销售记录列表
export const materialSellOrderPort = (p) => post("/materialSellOrderList", p);

// 撤销销售记录
export const materialSellDetailRevokePort = (p) =>
  get("/materialSellDetailRevoke", p);

// 根据发票号删除销售记录
export const materialSellOrderRevokePort = (p) =>
  get("/materialSellOrderRevoke", p);

// 修改加工厂库存状态
export const materialStatePort = (p) => post("/materialStateSave", p);
