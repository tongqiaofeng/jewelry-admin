// 仅成品模块使用
import {
  get,
  post
} from '../http'

// 成品出库
export const productOutDoPort = (p) => post('/productOutDo', p)

// 获取有效活动列表
export const validActivityPort = () => get('/validActivityList')

// 获取成品有产品仓库
export const warehouseProductTotalGetPort = (p) => post('/warehouseProductTotalGet', p)

// 获取销售记录列表
export const productSellOrderPort = (p) => post('/productSellOrderList', p)

// 删除销售记录
export const productSellDetailRevokePort = (p) => get('/productSellDetailRevoke', p)

// 根据发票号删除销售记录 
export const productSellOrderRevokePort = (p) => get('/productSellOrderRevoke', p)