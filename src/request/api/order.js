// 订单模块
import {
  get,
  post
} from '../http'

// 订单发货
export const deliverGoodsPort = (p) => post('/deliverGoods', p)

// 获取订单列表
export const orderListPort = (p) => post('/orderList', p)

// 获取快递公司列表
export const shipperCompanyPort = () => get('/shipperCompanyList')

// 退款给用户
export const refundPort = (p) => get('/refund', p)

// 审核退货退款申请
export const auditReturnPort = (p) => post('/auditReturn', p)

// 获取退货退款申请列表
export const unAuditReturnPort = (p) => post('/unAuditReturnList', p)