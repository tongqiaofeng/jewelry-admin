<template>
  <div id="productRemove" v-if="showContainer()">
    <div class="note-table">
      <div class="every1">时间</div>
      <div class="every2">内容</div>
      <div class="every3" v-show="!isUpdate">操作</div>
    </div>
    <div
      class="note-table"
      style="margin-top: 5px; margin-bottom: 30px"
      v-show="!isUpdate"
    >
      <div class="every1">
        <el-date-picker
          v-model="noteTime"
          type="date"
          :clearable="false"
          placeholder="请选择时间"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
        />
      </div>
      <div class="every2">
        <el-input
          v-model="noteFont"
          type="textarea"
          :rows="2"
          placeholder="请输入"
        />
      </div>

      <div class="every3">
        <div class="btn-row" style="cursor: pointer">
          <i
            class="el-icon-circle-plus-outline"
            style="font-size: 22px;color: #3d81fd;"
            @click="addNote"
          ></i>
        </div>
      </div>
    </div>
    <div>
      <div
        class="note-table"
        style="margin-bottom: 10px"
        v-for="(items, index) in recordList"
        :key="index"
      >
        <div class="every1">
          <el-date-picker
            :clearable="false"
            v-model="items.time"
            type="date"
            placeholder="请选择时间"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          />
        </div>
        <div class="every2">
          <el-input
            v-model="items.note"
            :rows="2"
            type="textarea"
            placeholder="请输入"
          />
        </div>

        <div class="every3" v-show="!isUpdate">
          <div class="btn-row" style="cursor: pointer">
            <i
              class="el-icon-delete"
              style="font-size: 22px;color: #3d81fd;"
              @click="delNote(index)"
            ></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      recordList: [],
      noteTime: "",
      noteFont: "",
    };
  },
  props: {
    note: {
      type: [Array, String],
    },
    isUpdate: {
      type: String,
    },
    id: {
      type: [Number, String],
    },
  },
  watch: {
    // immediate属性设置为true，代表在wacth里声明了note这个方法之后立即先去执行handler方法
    note: {
      handler: function(newVal, oldVal) {
        console.log("获取转移记录组件");
        console.log(newVal);
        console.log(oldVal);
        console.log(typeof newVal);

        if (newVal) {
          if (newVal.indexOf("|") == -1) {
            this.recordList = newVal;
          } else {
            this.recordList = newVal.split("|");
          }
        }
      },
      immediate: true,
    },
  },
  mounted() {
    console.log(this.isUpdate);
    this.noteTime = this.shellDate(new Date());
  },
  methods: {
    showContainer() {
      if (this.isUpdate) {
        if (this.recordList.length > 0) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    },
    // 添加备注
    addNote() {
      if (this.noteFont) {
        this.recordList.unshift({
          time: this.noteTime,
          note: this.noteFont,
        });

        //对数组根据日期进行排序
        this.recordList.sort((a, b) => {
          return new Date(b.time).getTime() - new Date(a.time).getTime();
        });

        this.noteTime = this.shellDate(new Date());
        this.noteFont = "";

        if (this.id) {
          this.$emit("noteContent", {
            id: this.id,
            record: this.recordList,
          });
        } else {
          this.$emit("noteContent", this.recordList);
        }
      } else {
        this.$message.error({
          message: "请输入记录内容",
          duration: 2000,
        });
      }
    },
    // 删除该条备注
    delNote(index) {
      this.recordList.splice(index, 1);
      this.recordList.sort((a, b) => {
        return new Date(b.time).getTime() - new Date(a.time).getTime();
      });

      if (this.id) {
        this.$emit("noteContent", {
          id: this.id,
          record: this.recordList,
        });
      } else {
        this.$emit("noteContent", this.recordList);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
