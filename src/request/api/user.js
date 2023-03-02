// 用户信息相关接口
import {
  post
} from '../http'

// 用户登录
export const userLogin = (p) => post('/userLogin', p)

// 修改密码
export const updatePsw = (p) => post('/userModify', p)

// 新增用户
export const staffSavePort = (p) => post('/staffSave', p)

// 删除用户
export const staffDeletePort = (p) => post('/staffDelete', p)

// 获取用户列表
export const staffListPort = () => post('/staffList')