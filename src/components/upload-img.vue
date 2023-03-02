<template>
  <div class="upload-imgs">
    <div class="add" v-if="isUpdate == 1">
      <form enctype="multipart/form-data" style="width: 100px; height: 100px">
        <input
          @change="inputChange($event)"
          type="file"
          name="upload-images"
          accept="image/*"
          class="inputUpload"
          multiple
        />
        <i class="el-icon-plus addIcon"></i>
      </form>
    </div>

    <draggable
      v-model="imageUrl"
      item-key="index"
      animation="300"
      @update="datadragEnd"
    >
      <transition-group style="display: flex; flex-wrap: wrap">
        <div
          v-for="(item, index) in imageUrl"
          :key="item"
          style="display: flex; margin-right: 10px"
        >
          <div style="position: relative;cursor: pointer;">
            <span
              class="spanStyle"
              @click="delImage(index)"
              v-if="isUpdate == 1"
              >x</span
            >
            <img
              :src="baseUrl + '/file/' + item"
              v-image-preview
              style="width: 100px;height: 100px;border-radius: 5px;object-fit: cover;cursor: pointer;"
            />
          </div>
        </div>
      </transition-group>
    </draggable>
  </div>
</template>

<script>
import { base_request_url } from "_req/http";
import { uploadPort } from "_req/api/common";
import draggable from "vuedraggable";

export default {
  components: {
    draggable,
  },
  data() {
    return {
      imageUrl: [],
      baseUrl: "",
    };
  },
  props: {
    imgUrl: {
      type: [Array, String],
    },
    isUpdate: {
      type: Number,
    },
    imgType: {
      type: Number,
    },
  },
  watch: {
    // immediate属性设置为true，代表在wacth里声明了imgUrl这个方法之后立即先去执行handler方法
    imgUrl: {
      handler: function(newVal, oldVal) {
        console.log("上传图片组件");
        console.log(newVal);
        console.log(oldVal);
        console.log(typeof newVal);

        if (newVal) {
          if (newVal.indexOf("|") == -1) {
            this.imageUrl = newVal;
          } else {
            this.imageUrl = newVal.split("|");
          }
        }
      },
      immediate: true,
    },
    // isUpdate:{
    //   handler:function(){},
    //   immediate:true
    // }
  },
  created() {
    console.log("地址", base_request_url);
    this.baseUrl = base_request_url;
  },
  methods: {
    datadragEnd(evt) {
      evt.preventDefault();
      console.log("拖动前的索引 :" + evt.oldIndex);
      console.log("拖动后的索引 :" + evt.newIndex);
      console.log(this.imageUrl);
      this.$emit("imgChange", {
        img: this.imageUrl,
      });
    },
    // 1、获取input上传file文件，inputChange
    // 2、大于2M压缩，否则直接上传
    // 压缩过程
    // 1、读取文件，photoCompress2
    // 2、利用canvas数据化图片进行压缩，图片转base64，canvasDataURL2
    // 3、图片base64 转Blob格式/file格式，base64UrlToBlob2
    // 4、上传图片，uploadLice2
    // 多张图片上传
    inputChange(e) {
      let files = e.target.files;

      if (files == undefined) {
        return;
      } else {
        console.log("文件", files);
        for (let i = 0; i < files.length; i++) {
          // 文件大于2M，进行压缩上传
          if (files[i].size / 1024 > 2050) {
            console.log("压缩");
            this.photoCompress2(
              files[i],
              {
                // 调用压缩图片方法
                quality: 0.7,
              },
              (base64Codes) => {
                let bl = this.base64UrlToBlob2(base64Codes);
                this.uploadLice2(bl); // 请求图片上传接口
              }
            );
          } else {
            // 小于等于2M 原图上传
            this.uploadLice2(files[i]);
          }
        }
      }
    },
    /*压缩图片
      读取文件
      file：文件(类型是图片格式)，
      obj：文件压缩后对象width， height， quality(0-1)
      callback：容器或者回调函数
      */
    photoCompress2(file, obj, callback) {
      let ready = new FileReader(); //实例化reader，读取文件内容
      ready.readAsDataURL(file); // 把目标文件转地址
      ready.onload = (event) => {
        // 文件读取成功
        let res = event.target.result;
        this.canvasDataURL2(res, obj, callback); // 开始压缩
      };
    },
    /* 利用canvas数据化图片进行压缩 */
    /* 图片转base64 */
    canvasDataURL2(path, obj, callback) {
      let img = new Image();
      img.src = path;
      img.onload = function() {
        let that = this; // 指到img
        // 默认按比例压缩
        let w = that.width,
          h = that.height,
          scale = w / h;
        w = obj.width || w;
        h = obj.height || w / scale;
        let quality = 0.7; // 默认图片质量为0.7
        // 生成canvas
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");

        // 创建节点属性
        let anw = document.createAttribute("width");
        anw.nodeValue = w;
        let anh = document.createAttribute("height");
        anh.nodeValue = h;
        canvas.setAttributeNode(anw);
        canvas.setAttributeNode(anh);
        // 铺底色
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(that, 0, 0, w, h);

        // 图像质量
        if (obj.quality && obj.quality >= 1 && obj.quality < 0) {
          quality = obj.quality;
        }
        // quality值越小，所绘制出的图像越模糊
        // 返回值是一个数据url，是base64组成的图片的源数据、可以直接赋值给图片的src属性
        let base64 = canvas.toDataURL("image/jpeg", quality);
        // 回调函数返回base64的值
        callback(base64);
      };
    },
    // base64 转Blob格式/file格式
    base64UrlToBlob2(urlData) {
      console.log("转Blob格式/file格式", urlData);

      let arr = urlData.split(",");
      let mime = arr[0].match(/:(.*?);/)[1]; // 去掉url的头，并转化为byte
      let bstr = window.atob(arr[1]); // new Buffer.from(arr[1], "base64").toString("binary"), // 处理异常,将ascii码小于0的转换为大于0
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      console.log("u8arr数据", u8arr);

      // 转blob
      // return new Blob([u8arr], {type: mime})

      // 转file
      let filename = Date.parse(new Date()) + ".jpg";
      /* [u8arr] 文件的內容  filename 文件的文件名/文件路徑  { type: mime } 配置對象 */
      return new File([u8arr], filename, {
        type: mime,
      });
    },
    // 返回file文件，调用接口执行上传
    uploadLice2(file) {
      console.log("圖片file", file);

      uploadPort({
        file,
      })
        .then((res) => {
          if (res.status == 200) {
            this.$message.success({
              message: "图片上传成功",
              showClose: true,
              duration: 2000,
            });
          }
          console.log(res);

          this.imageUrl.push(res.data.data.fileName);
          this.$emit("imgChange", {
            img: this.imageUrl,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 刪除圖片
    delImage(index) {
      console.log(index);

      this.imageUrl.splice(index, 1);

      console.log("删除图片", this.imageUrl);
      this.$emit("imgChange", {
        img: this.imageUrl,
      });
    },
  },
};
</script>

<style lang="scss">
.upload-imgs {
  width: 100%;
  position: relative;
  display: flex;

  .add {
    width: 100px;
    height: 100px;
    margin-right: 10px;
    position: relative;
    border: 1px solid #ddd;
    border-radius: 5px;
    display: flex;

    .addIcon {
      width: 15px;
      height: 15px;
      position: absolute;
      top: 42px;
      left: 42px;
      z-index: 1;
    }

    .inputUpload {
      position: absolute;
      display: block;
      width: 100px;
      height: 100px;
      opacity: 0;
      cursor: pointer;
      z-index: 999;
    }
  }

  .every-img {
    width: 100px;
    height: 100px;
    margin-right: 10px;
    position: relative;
    cursor: pointer;

    .spanStyle {
      width: 15px;
      height: 15px;
      position: absolute;
      top: 1px;
      right: 1px;
      text-align: center;
      line-height: 0.9;
      background-color: rgb(221, 221, 221);
      color: rgb(255, 255, 255);
      border: 1px solid rgb(221, 221, 221);
      border-radius: 50%;
      z-index: 999;
      cursor: pointer;
    }
  }
}
</style>
