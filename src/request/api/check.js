import { post, get } from "../http";

// 新增盘点
export const InventoryCheckOrderSavePort = (p) =>
  post("/InventoryCheckOrderSave", p);

// 获取盘点单列表
export const inventoryCheckOrderListPort = (p) =>
  post("/inventoryCheckOrderList", p);

// 删除盘点
export const inventoryCheckOrderDelPort = (p) =>
  get("/inventoryCheckOrderDel", p);
