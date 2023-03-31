<template>
  <div class="design-update-container">
    <!-- <h1>设计图列表及修改</h1> -->
    <div style="width: 80%;">
      <div style="display:flex;padding: 30px 20px 0 20px;">
        <el-input placeholder="可输入设计图名称、设计师名称、标签、设计理念等搜索" v-model="designListKeyword"></el-input><el-button type="primary"
          style="margin-left: 10px;" @click="handleCurrentChange(1)">搜索</el-button>
      </div>
      <div style="padding: 20px;">
        <el-radio-group v-model="display" @change="handleCurrentChange(1)">
          <el-radio label="2">全部</el-radio>
          <el-radio label="0">小程序未显示</el-radio>
          <el-radio label="1">小程序已显示</el-radio>
        </el-radio-group>
      </div>
      <el-table :data="producibleDesignList" highlight-current-row border @row-click="checkDesignDetail"
        ref="multipleTable">
        <el-table-column align="center" prop="name" label="设计图名称">
        </el-table-column>
        <el-table-column align="center" prop="designerName" label="设计师名称">
        </el-table-column>
        <el-table-column align="center" prop="label" label="标签">
        </el-table-column>
        <el-table-column align="center" prop="designId" label="设计图片">
          <template slot-scope="scope">
            <img :src="axiosUrl + '/file/' + imgFilter(scope.row.img)"
              style="width: 100px;height: 100px;object-fit: cover;" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="90px">
          <template>
            <el-button type="text" style="color: #3d81fd;">
              修改信息
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="width: 100%;height: 50px;">
        <div style="margin:15px 0;position:absolute;right:20%;">
          <el-pagination @current-change="handleCurrentChange" :current-page="page" :page-size="5"
            layout="total, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>

      <el-dialog v-if="dialogDesignUpdateVisible" title="设计图信息" :visible.sync="dialogDesignUpdateVisible"
        :close-on-press-escape="false" :close-on-click-modal="false" :modal-append-to-body="false" :append-to-body="false"
        id="designUpdate">
        <div>
          <el-form label-width="110px">
            <el-form-item prop="name" label="设计图名称">
              <el-input type="text" readonly v-model="updateDesignMsg.name"></el-input>
            </el-form-item>
            <el-form-item prop="designerName" label="设计师名称">
              <el-input type="text" readonly v-model="updateDesignMsg.designerName"></el-input>
            </el-form-item>
            <el-form-item label="图片">
              <uploadImg :imgUrl="imgList" :isUpdate="0" :isDesign="'是'"></uploadImg>
            </el-form-item>
            <el-form-item prop="label" label="标签">
              <el-select v-model="updateDesignMsg.label" placeholder="可输入创建选择/直接多选" multiple filterable allow-create
                style="width: 100%;">
                <el-option v-for="item in designLabelList" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="designConcept" label="设计理念">
              <el-input type="textarea" v-model="updateDesignMsg.designConcept"></el-input>
            </el-form-item>
            <el-form-item prop="display" label="小程序是否显示">
              <el-switch v-model="updateDesignMsg.display" active-color="#13ce66" inactive-color="#ff4949"
                active-value="1" inactive-value="0">
              </el-switch>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer">
          <el-button @click="dialogDesignUpdateVisible = false">取 消</el-button>
          <el-button type="primary" @click="designUpdateSure" v-preventClick>确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { base_request_url } from "_req/http";
import { designListPort } from "_req/api/common";
import {
  producibleDesignSavePort,
  designLabelListPort,
} from "_req/api/program";

import uploadImg from "@/components/upload-img";
export default {
  components: { uploadImg },
  data() {
    return {
      axiosUrl: "",
      page: 1,
      total: 0,
      designListKeyword: "",
      display: "1",
      chooselistimg: "",
      chooselistimgtemp: [],
      producibleDesignList: [],

      dialogDesignUpdateVisible: false,
      imgList: [],
      updateDesignMsg: {},
      designLabelsList: [],
      designLabelList: [],
    };
  },
  created() {
    this.axiosUrl = base_request_url;
    this.getproducibleDesignList();
    this.getDesignLabelList();
  },
  methods: {
    // 修改查看设计图
    checkDesignDetail(row, column) {
      console.log(row);
      if (column.label === "操作") {
        this.updateDesignMsg = JSON.parse(JSON.stringify(row));
        this.updateDesignMsg.label = this.updateDesignMsg.label.split("|");
        this.updateDesignMsg.display = this.updateDesignMsg.display + "";
        this.imgList = this.imgListFilter(this.updateDesignMsg.img);
        this.dialogDesignUpdateVisible = true;
      }
    },

    // 确定修改
    designUpdateSure() {
      this.updateDesignMsg.label = this.updateDesignMsg.label.join("|");
      producibleDesignSavePort(this.updateDesignMsg)
        .then((res) => {
          console.log("修改设计图", res);
          this.$message.success("修改成功");
          this.dialogDesignUpdateVisible = false;
          this.getproducibleDesignList();
        })
        .catch((err) => {
          console.log(err);
          this.updateDesignMsg.label = this.updateDesignMsg.label.split("|");
        });
    },

    // 设计稿列表
    getproducibleDesignList() {
      console.log(this.designListKeyword);

      designListPort({
        keyword: this.designListKeyword,
        status: 0,
        display: this.display == 2 ? null : this.display,
        page: this.page,
        pageNum: 5,
      }).then((res) => {
        console.log("设计列表");
        console.log(res);
        this.producibleDesignList = res.data.data.list;
        this.total = res.data.data.total;
      });
    },
    // 分页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
      this.getproducibleDesignList();
      document.getElementById("mainContainer").scrollTop = 0;
    },
    // 获取标签列表
    getDesignLabelList() {
      designLabelListPort().then((res) => {
        console.log("设计图标签", res);
        this.designLabelList = res.data.data;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.design-update-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 6px;
  text-align: left;

  .design-btn {
    margin-top: 30px;
    text-align: right;
  }
}
</style>
<style lang="scss">
#designUpdate {
  .el-dialog__body {
    height: 500px !important;
    padding-top: 30px !important;
    overflow: auto;
  }
}
</style>
