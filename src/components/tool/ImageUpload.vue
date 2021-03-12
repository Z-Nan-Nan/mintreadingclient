<template>
  <div class="info-item" style="flex:1; margin-top:30px; margin-right: 200px;">
    <label class="btn btn-orange" for="uploads" style="display:inline-block;width: 70px;padding: 0;text-align: center;line-height: 28px; background-color: #3399ff; color: white; border-radius: 4px; height: 30px; font-size: 12px;">选择图片</label>
    <Button class="btn btn-orange" type="primary" value="上传图片" @click="finish('blob')">上传图片</Button>
    <Button class="btn btn-orange" type="primary" value="↺" @click="rotateLeft">左旋</Button>
    <Button class="btn btn-orange" type="primary" value="↺" @click="rotateRight">右旋</Button>
    <Button class="btn btn-orange" type="primary" value="放大" @click="changeScale(1)">放大</Button>
    <Button class="btn btn-orange" type="primary" value="缩小" @click="changeScale(-1)">缩小</Button>
    <input type="file" id="uploads" :value="imgFile" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event, 1)">
    <Input v-model="highMedia" style="width: 450px; margin-left: 20px;" readonly="" />
    <Button type="primary" @click="copyUrlHigh">复制链接</Button>
    <div class="line" style="margin-left: -280px;margin-top: 85px;">
      <div class="cropper-content" style="margin-top:-60px;margin-left:260px;">
        <div class="cropper">
          <vueCropper
            ref="cropper"
            :img="option.img"
            :enlarge="1"
            :outputSize="option.size"
            :outputType="option.outputType"
            :info="true"
            :full="option.full"
            :canMove="option.canMove"
            :canMoveBox="option.canMoveBox"
            :original="option.original"
            :autoCrop="option.autoCrop"
            :autoCropWidth="option.autoCropWidth"
            :autoCropHeight="option.autoCropHeight"
            :fixedBox="option.fixedBox"
            :centerBox="true"
            :canScale="true"
            @realTime="realTime"
            @imgLoad="imgLoad"
          ></vueCropper>
        </div>
        <div style="margin-left:20px; display: none;">
          <div class="show-preview" :style="{'width': '150px', 'height':'155px',  'overflow': 'hidden', 'margin': '5px'}">
            <div :style="previews.div" class="preview">
              <img :src="previews.url" :style="previews.img" id="clipImage">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { VueCropper } from 'vue-cropper';
export default {
  name: 'ImageUpload',
  components: {VueCropper, axios},
  data() {
    return {
      option: {
        img: '',
        outputSize: 1,
        full: false,
        outputType: 'jpeg',
        canMove: false,
        original: true,
        canMoveBox: true,
        autoCrop: true,
        autoCropWidth: 339,
        autoCropHeight: 217,
        fixed: true,
        fixedBox: false
      },
      baseCode: '',
      headImg: '',
      crap: false,
      previews: {},
      fileName: '',
      downImg: '#',
      imgFile: '',
      uploadImgRelaPath: '',
      formValidate: {
        img_name: 0,
        show_type: 'banner',
        date: '',
        date2: '',
        term_key: '0',
        key_to: '',
        key_except: '',
        teacher: '',
        url: '',
        note: ''
      },
      media: '',
      highMedia: ''
    };
  },
  methods: {
    rotateLeft() {
      console.log('rotateLeft');
      this.$refs.cropper.rotateLeft();
    },
    rotateRight() {
      console.log('rotateRight');
      this.$refs.cropper.rotateRight();
    },
    finish(type) {
      const that = this;
      if (type === 'blob') {
        this.$refs.cropper.getCropBlob((data) => {
          let formData = new FormData();
          formData.append('media', data, this.fileName);
          axios.post('http://rdmint-admin.baicizhan.com//api/abtest/upfile/images', formData).then(res => {
            // console.log(res);
            that.highMedia = `https://rdmint-admin.baicizhan.com/media/${res.data.data.media_path}`;
          });
        });
      }
    },
    // 实时预览函数
    realTime(data) {
      this.previews = data;
      if (this.$refs.cropper.getImgAxis().x1 < 0) {
        for (let i = 0; i < (parseInt(this.previews.img.width) / 720) * 10 - 1; i++) {
          this.changeScale(-1);
        }
      }
      if (this.$refs.cropper.getImgAxis().y1 < 0) {
        for (let i = 0; i < (parseInt(this.previews.img.width) / 540) * 2 - 1; i++) {
          this.changeScale(-1);
        }
      }
    },
    uploadImg(e, num) {
      // console.log('uploadImg');
      var file = e.target.files[0];
      this.fileName = file.name;
      // console.log(this.fileName);
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种');
        return false;
      }
      var reader = new FileReader();
      reader.onload = (e) => {
        let data;
        if (typeof e.target.result === 'object') {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          data = e.target.result;
        }
        if (num === 1) {
          this.option.img = data;
        } else if (num === 2) {
          this.example2.img = data;
        }
      };
      // 转化为base64
      reader.readAsDataURL(file);
      // console.log(reader);
      this.baseCode = reader.result;
      // 转化为blob
      // reader.readAsArrayBuffer(file);
    },
    imgLoad (msg) {
      // console.log('imgLoad');
    },
    changeScale(num) {
      num = num || 1;
      this.$refs.cropper.changeScale(num);
    },
    getUpAction () {
      return 'http://rdmint-admin.baicizhan.com/' + '/api/abtest/upfile/images';
    },
    upSuccess (res, file, filelist) {
      this.formValidate.img_url = 'http://ali.baicizhan.com/' + res.data.key;
      this.media = 'http://ali.baicizhan.com/' + res.data.key;
      this.formValidate.img_name = res.data.key.split('readin/images/')[1];
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
      });
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: '超出文件大小限制',
        desc: '文件 ' + file.name + ' 太大，不能超过 500kb。'
      });
    },
    copyUrlHigh () {
      const self = this;
      this.$copyText(this.highMedia).then(function (e) {
        self.$Message.success('复制成功！！！');
      }, function (e) {
        self.$Message.error('复制失败！！！');
        console.log(e);
      });
    }
  }
};
</script>

<style lang="less" scoped>
.cropper-content{
  display: flex;
  display: -webkit-flex;
  justify-content: flex-end;
  -webkit-justify-content: flex-end;
  .cropper{
    width: 720px;
    height: 540px;
  }
  .show-preview{
    flex: 1;
    -webkit-flex: 1;
    display: flex;
    display: -webkit-flex;
    justify-content: center;
    -webkit-justify-content: center;
    .preview{
      overflow: hidden;
      border:1px solid #cccccc;
      background: #cccccc;
      margin-left: 40px;
    }
  }
}
.cropper-content .show-preview .preview {margin-left: 0;}
</style>
