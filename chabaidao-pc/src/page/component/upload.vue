<template>
    <el-upload
        ref="uploadEle"
        :action="imageUrl"
        accept=".jpg,.png,.jpeg,.webp"
        :limit="1"
        :show-file-list="false"
        :on-success="onSuccess"
        :on-error="onError"
        >
        <div class="left-upload left-upload-icon">
            <div class="left-upload-icon" v-if="uploadImgurl == ''">
                <el-icon :size="20"><Plus /></el-icon>
                <span>建议上传大小不超过500kb</span>
            </div>
            <div v-else>
                <img :src="uploadImgurl" alt="">
            </div>
        </div>
    </el-upload>
</template>

<script setup>
    import {ref,reactive} from 'vue'
    import { ElMessage } from 'element-plus'
    import {Plus} from '@element-plus/icons-vue'
    import {imageUrl} from '@/api/request.js'
    import emitter from '@/api/event.js'
    defineProps({width:String})
    // 未上传和已上传的图片展示
    const uploadImgurl = ref('')
    const uploadEle = ref(null)
    // 上传成功
    function onSuccess(response){
		console.log(response)
        uploadImgurl.value = response.data
        uploadEle.value.clearFiles()
        emitter.emit('upload-image-Success',{url:response.data});
    }
    // 上传失败
    function onError(event){
        console.log(event);
        ElMessage('上传图片失败')
    }
    // 其他父组件页面上传成功清空当前图片值
    emitter.on('clear-image', () => {
        uploadImgurl.value = ''
    });
</script>

<style>
.left-upload{
    border: 1px dashed rgba(0,0,0,.3);
    color: rgba(0,0,0,.3);
    width: v-bind('width');
    height: v-bind('width');
    border-radius: 4px;
    overflow: hidden;
}
.left-upload-icon{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.left-upload-icon span{
    font-size: 15px;
    text-align: center;
}
.left-upload img{
    width: v-bind('width');
    height: v-bind('width');
    object-fit: cover;
}
</style>