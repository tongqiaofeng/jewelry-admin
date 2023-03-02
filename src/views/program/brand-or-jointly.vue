<template>
  <div class="classify-img-container">
    <!-- 产品分类页面展示图 -->
    <div v-if="pageSel === 0">
      <div style="margin-bottom: 20px;text-align: right;">
        <el-button type="primary" @click="addJump">添加</el-button>
      </div>
      <el-table
        :data="seriesImgList"
        highlight-current-row
        style="width: 100%"
        border
      >
        <el-table-column align="center" prop="viewType" label="类型">
          <template slot-scope="scope">
            <div>
              <span>{{
                scope.row.viewType == 0
                  ? "整体图+路径"
                  : "标题图+背景图+关联路径"
              }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="titleImg" label="标题图">
          <template slot-scope="scope">
            <div>
              <span v-if="!scope.row.titleImg">---</span>
              <img
                v-else
                :src="axiosUrl + '/file/' + scope.row.titleImg"
                width="100px"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="backgroundImg"
          label="整体图/背景图"
        >
          <template slot-scope="scope">
            <div>
              <span v-if="!scope.row.backgroundImg">---</span>
              <img
                v-else
                :src="axiosUrl + '/file/' + scope.row.backgroundImg"
                width="100px"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="sort" label="排序">
          <template slot-scope="scope">
            <div>
              <el-input
                v-model="scope.row.sort"
                @change="updateSort(scope.row)"
              ></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <div>
              <el-button type="text" @click="updateSeriesImg(scope.row)"
                >修改</el-button
              >
              <el-button type="text" @click="delSeriesImg(scope.row)"
                >删除</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-else style="text-align: left;">
      <imgAndUrl
        :manageType="1"
        :updateMsg="updateMsg"
        @imgAndUrlSubmit="imgAndUrlSubmit"
      ></imgAndUrl>
    </div>

    <el-dialog
      title="删除"
      :visible.sync="dialogDeleteVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :append-to-body="false"
      id="delInven"
    >
      <div style="text-align: center;">
        <p style="margin: 30px 0 0 0;font-size: 16px;color: #4e4e4e;">
          确定删除该图片？删除后不可修改
        </p>
      </div>
      <div slot="footer">
        <el-button @click="dialogDeleteVisible = false">取 消</el-button>
        <el-button type="primary" @click="delSeriesSure" v-preventClick
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { base_request_url } from "_req/http";
import {
  webConfigListPort,
  webConfigSortPort,
  webConfigDelPort,
} from "_req/api/common";

import imgAndUrl from "@/components/imgAndUrl";
export default {
  components: { imgAndUrl },
  data() {
    return {
      axiosUrl: "",
      pageSel: 0,

      seriesImgList: [],
      updateMsg: {},

      dialogDeleteVisible: false,
      delId: null,
    };
  },
  created() {
    this.axiosUrl = base_request_url;
    this.getList(0);
  },
  methods: {
    // 修改排序
    updateSort(row) {
      console.log(row);
      webConfigSortPort({
        id: row.id,
        sort: row.sort,
      }).then((res) => {
        console.log("修改排序", res);
        this.$message.success("修改成功");
        this.getList();
      });
    },
    // 修改
    updateSeriesImg(row) {
      this.updateMsg = JSON.parse(JSON.stringify(row));
      this.pageSel = 1;
    },
    // 添加
    addJump() {
      this.updateMsg = {};
      this.pageSel = 1;
    },
    // 确定添加/修改
    imgAndUrlSubmit(val) {
      this.pageSel = 0;
      if (val == 1) {
        this.getList();
      }
    },
    // 删除
    delSeriesImg(row) {
      this.delId = row.id;
      this.dialogDeleteVisible = true;
    },
    // 确定删除
    delSeriesSure() {
      webConfigDelPort({
        id: this.delId,
      })
        .then((res) => {
          console.log("删除", res);
          this.$message.success("删除成功");
          this.dialogDeleteVisible = false;
          this.getList();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取图片列表
    getList() {
      webConfigListPort({
        manageType: 1,
      }).then((res) => {
        console.log("获取网页设置列表", res);
        this.seriesImgList = res.data.data;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.classify-img-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 6px;

  .add-left {
    width: 50%;
    padding: 10px;
    margin-right: 10px;
    text-align: left;
    background-color: #fff;
    border-radius: 6px;

    .num {
      text-align: center;
    }
  }

  .add-right {
    width: 50%;
    padding: 10px;
    text-align: left;
    background-color: #fff;
    border-radius: 6px;

    .title-font {
      height: 48px;
      margin: 0;
      text-align: left;
      color: #6a6a6a;
      font-size: 18px;
      font-weight: bold;
    }
  }

  .img-container-every {
    display: flex;
    justify-content: space-between;

    .img {
      width: 50%;
      text-align: center;
    }

    .url {
      width: 40%;
      text-align: center;
    }

    .do {
      width: 10%;
      text-align: center;
    }
  }
}
</style>
