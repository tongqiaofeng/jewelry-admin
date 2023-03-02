<template>
  <div class="design-update-container">
    <!-- <h1>设计图列表及修改</h1> -->
    <div style="width: 80%;">
      <div class="back-img" @click="imglistout">
        <img class="back-icon" src="../assets/imgs/goback.png" />
        <span class="font">返回</span>
      </div>
      <div style="display:flex;padding: 30px 20px 0 20px;">
        <el-input
          placeholder="可输入设计图名称、设计师名称、标签、设计理念等搜索"
          v-model="designListKeyword"
        ></el-input
        ><el-button
          type="primary"
          style="margin-left: 10px;"
          @click="handleCurrentChange(1)"
          >搜索</el-button
        >
      </div>
      <div style="padding: 20px;">
        <el-radio-group v-model="statusDesign" @change="handleCurrentChange(1)">
          <el-radio label="0">全部</el-radio>
          <el-radio label="1">未生产</el-radio>
        </el-radio-group>
      </div>
      <el-table
        :data="producibleDesignList"
        highlight-current-row
        border
        @row-dblclick="chooseimglist"
        ref="multipleTable"
      >
        <el-table-column align="center" prop="name" label="设计图名称">
        </el-table-column>
        <el-table-column align="center" prop="designerName" label="设计师名称">
        </el-table-column>
        <el-table-column align="center" prop="label" label="标签">
        </el-table-column>
        <el-table-column align="center" prop="designId" label="设计图片">
          <template slot-scope="scope">
            <img
              :src="axiosUrl + '/file/' + imgFilter(scope.row.img)"
              style="width: 100px;height: 100px;object-fit: cover;"
            />
          </template>
        </el-table-column>
      </el-table>
      <div style="width: 100%;height: 50px;">
        <div style="margin:15px 0;position:absolute;right:20%;">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-size="5"
            layout="total, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { base_request_url } from "_req/http";
import { designListPort } from "_req/api/common";

export default {
  data() {
    return {
      axiosUrl: "",
      page: 1,
      total: 0,
      designListKeyword: "",
      statusDesign: "1",

      chooselistimgtemp: {},
      producibleDesignList: [],
    };
  },
  created() {
    this.axiosUrl = base_request_url;
    this.getproducibleDesignList();
  },
  methods: {
    //选择设计图片
    chooseimglist(row) {
      console.log(row);
      if (row) {
        this.chooselistimgtemp = row;
        this.$emit("designSel", {
          val: this.chooselistimgtemp,
          isClose: 0,
        });

        this.designListKeyword = "";
      }
    },
    //取消选择
    imglistout() {
      this.$emit("designSel", {
        val: this.chooselistimgtemp,
        isClose: 1,
      });
      this.designListKeyword = "";
    },
    // 设计稿列表
    getproducibleDesignList() {
      console.log(this.designListKeyword);

      designListPort({
        keyword: this.designListKeyword,
        status: this.statusDesign,
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
