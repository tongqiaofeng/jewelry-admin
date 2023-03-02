<template>
  <div class="user-admin-container" id="user-admin">
    <!-- <h1>用户管理</h1> -->
    <div class="user-edit">
      <el-form
        label-position="right"
        :model="userFormData"
        :rules="userRules"
        ref="userForm"
        label-width="130px"
        class="demo-ruleForm"
      >
        <el-form-item label="姓名：" prop="nick">
          <el-input v-model="userFormData.nick" clearable></el-input>
        </el-form-item>
        <el-form-item label="用户名：" prop="user">
          <el-input v-model="userFormData.user" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="psw">
          <el-input v-model="userFormData.psw" clearable></el-input>
        </el-form-item>
        <el-form-item label="币种：" prop="currencyId">
          <el-select v-model="userFormData.currencyId" placeholder="请选择币种">
            <el-option
              v-for="item in currencyList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="管辖仓库/加工厂：" prop="warehouseIdList">
          <el-select
            v-model="userFormData.warehouseIdList"
            multiple
            placeholder="可多选"
            :popper-append-to-body="false"
          >
            <el-option
              v-for="item in storageList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统管理员权限：">
          <el-switch
            v-model="userFormData.isAdmin"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="1"
            inactive-value="0"
          ></el-switch>
        </el-form-item>
        <el-form-item>
          <div style="margin-right: 30px;text-align: right;">
            <el-button
              type="primary"
              @click="userAdd('userForm')"
              v-preventClick
              >+ 新 建</el-button
            >
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="user-table">
      <!-- @current-change="userChange" -->
      <el-table
        :data="staffList"
        style="width: 100%"
        border
        row-key="id"
        highlight-current-row
      >
        <el-table-column align="center" prop="nick" label="姓名">
        </el-table-column>
        <el-table-column align="center" prop="user" label="用户名">
        </el-table-column>
        <el-table-column
          align="center"
          prop="warehouseFactoryName"
          label="管辖仓库/加工厂"
        >
          <template slot-scope="scope">
            <div>
              <p
                style="margin: 0;"
                v-for="(ware, index) in scope.row.warehouseFactoryName.split(
                  '|'
                )"
                :key="index"
              >
                {{ ware }}
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="120px">
          <template slot-scope="scope">
            <div class="cell-work">
              <el-button type="text" @click="userUpdate(scope.row)">
                修改
              </el-button>
              <el-dialog
                title="修改员工信息"
                :visible.sync="dialogUserUpdateVisible"
                :close-on-press-escape="false"
                :close-on-click-modal="false"
                :modal-append-to-body="false"
                :append-to-body="true"
                id="updateUser"
              >
                <el-form label-width="130px" id="update">
                  <el-form-item label="姓名：" prop="nick">
                    <el-input
                      v-model="updateDetail.nick"
                      clearable
                      class="input-style"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="用户名：" prop="user">
                    <el-input
                      v-model="updateDetail.user"
                      clearable
                      class="input-style"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="密码：" prop="psw">
                    <el-input
                      v-model="updateDetail.psw"
                      clearable
                      class="input-style"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    label="管辖仓库/加工厂："
                    prop="warehouseFactoryIdList"
                  >
                    <el-select
                      v-model="updateDetail.warehouseFactoryIdList"
                      multiple
                      placeholder="可多选"
                      :popper-append-to-body="false"
                    >
                      <el-option
                        v-for="item in storageList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="系统管理员权限：">
                    <el-switch
                      v-model="updateDetail.isAdmin"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      active-value="1"
                      inactive-value="0"
                    >
                    </el-switch>
                  </el-form-item>
                </el-form>
                <div slot="footer">
                  <el-button @click="dialogUserUpdateVisible = false"
                    >取 消</el-button
                  >
                  <el-button
                    type="primary"
                    @click="userUpdateSure"
                    v-preventClick
                    >确 定</el-button
                  >
                </div>
              </el-dialog>
              <el-button
                type="text"
                style="margin-left: 15px;color: red;"
                @click="userDelete(scope.row)"
                >删除
              </el-button>
              <el-dialog
                title="删除员工"
                :visible.sync="dialogUserDeleteVisible"
                :close-on-press-escape="false"
                :close-on-click-modal="false"
                :modal-append-to-body="false"
                :append-to-body="true"
                id="delSale"
              >
                <div>
                  <p
                    style="margin-top: 10px;margin-bottom: 0;font-size: 16px;color: #4e4e4e;"
                  >
                    确定删除该员工？删除后不可修改
                  </p>
                </div>
                <div slot="footer">
                  <el-button @click="dialogUserDeleteVisible = false"
                    >取 消</el-button
                  >
                  <el-button
                    type="primary"
                    @click="userDeleteSure"
                    v-preventClick
                    >确 定</el-button
                  >
                </div>
              </el-dialog>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { warehouseFactoryPort } from "_req/api/common";
import { staffSavePort, staffDeletePort, staffListPort } from "_req/api/user";

export default {
  data() {
    return {
      userFormData: {
        nick: "",
        user: "",
        psw: "",
        currencyId: "",
        warehouseIdList: [],
        isAdmin: "0",
      },
      propsMenu: {
        checkStrictly: true,
        emitPath: false,
        value: "id",
        label: "label",
      },
      userRules: {
        nick: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur",
          },
        ],
        user: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
        ],
      },
      currencyList: [
        {
          value: 1,
          label: "CNY人民币",
        },
        {
          value: 2,
          label: "HKD港币",
        },
        {
          value: 3,
          label: "USD美元",
        },
        {
          value: 4,
          label: "EUR欧元",
        },
        {
          value: 5,
          label: "GBP英镑",
        },
        {
          value: 6,
          label: "AUD澳元",
        },
      ],

      staffList: [],
      userDetails: {},
      updateDetail: {},
      dialogUserUpdateVisible: false,
      deleteDetail: {},
      dialogUserDeleteVisible: false,

      storageList: [],
    };
  },
  created() {
    this.getWarehouseFactoryList();
    this.getStaffList();
  },
  methods: {
    // 新增用户
    userAdd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          staffSavePort(this.userFormData)
            .then((res) => {
              console.log("新增员工");
              console.log(res);
              this.$message.success({
                message: "添加成功",
                showClose: true,
                duration: 2000,
              });
              this.userFormData.nick = "";
              this.userFormData.user = "";
              this.userFormData.psw = "";
              this.userFormData.currencyId = "";
              this.userFormData.warehouseIdList = "";
              this.userFormData.isAdmin = "0";
              this.getStaffList();
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 修改
    userUpdate(val) {
      this.updateDetail = val;
      console.log(this.updateDetail);
      console.log(this.updateDetail.warehouseFactoryIdList);
      this.updateDetail.isAdmin = this.updateDetail.isAdmin + "";
      this.dialogUserUpdateVisible = true;
    },
    // 确定修改
    userUpdateSure() {
      staffSavePort({
        ...this.updateDetail,
        warehouseIdList: this.updateDetail.warehouseFactoryIdList,
      })
        .then((res) => {
          console.log("修改员工");
          console.log(res);
          this.$message.success({
            message: "修改成功",
            showClose: true,
            duration: 2000,
          });
          this.getStaffList();
          this.dialogUserUpdateVisible = false;
        })
        .catch((err) => {
          console.log(err);

          this.dialogUserUpdateVisible = false;
        });
    },
    // 删除
    userDelete(val) {
      this.deleteDetail = val;
      this.dialogUserDeleteVisible = true;
    },
    // 确定删除
    userDeleteSure() {
      staffDeletePort({
        id: this.deleteDetail.id,
      })
        .then((res) => {
          console.log("删除员工");
          console.log(res);
          this.$message.success({
            message: "删除成功",
            showClose: true,
            duration: 2000,
          });
          this.getStaffList();
          this.dialogUserDeleteVisible = false;
        })
        .catch((err) => {
          console.log(err);
          this.dialogUserDeleteVisible = false;
        });
    },
    // 选择用户
    userChange(value) {
      console.log(value);
    },
    // 获取员工列表
    getStaffList() {
      staffListPort()
        .then((res) => {
          console.log("员工列表");
          console.log(res);
          this.staffList = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取仓库/加工厂列表
    getWarehouseFactoryList() {
      warehouseFactoryPort()
        .then((res) => {
          console.log("仓库/加工厂");
          console.log(res);
          this.storageList = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.user-admin-container {
  display: flex;

  .user-edit {
    width: 510px;
    padding: 20px;
    background-color: #fff;
    border-radius: 6px;
  }

  .user-table {
    width: 610px;
    margin-left: 15px;
    padding: 20px;
    background-color: #fff;
    border-radius: 6px;
  }
}

.input-style {
  width: 100%;
}
</style>
<style lang="scss">
#user-admin {
  .el-form-item__content {
    text-align: left;
  }

  .el-select {
    width: 100%;
  }
}

#updateUser {
  .el-dialog__body {
    height: 400px;
  }
}

#update {
  .el-select {
    width: 100%;
  }
}
</style>
