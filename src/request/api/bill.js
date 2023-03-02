// 账单模块
import {
  post
} from '../http'

// 修改账单信息
export const updateBillPort = (p) => post('/updateBill', p)