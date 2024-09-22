<template>
    <view class="no-data" v-if="noData">
        <image src="/static/no-data.png" mode="widthFix" />
        <text>{{ tips }}</text>
    </view>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
    noData?: boolean
    tips?: string
}>(),{
    noData:false,
    tips:'买个蛋，没货了'
})
</script>
<style>
.no-data{
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #b8b8b8;
    padding-top: 200rpx;
}
.no-data image{
    width: 300rpx;
}
</style>