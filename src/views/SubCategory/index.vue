<script setup>
import { getCategoryFilterAPI,getSubCategoryAPI } from '@/apis/category';
import GoodsItem from '../Home/components/GoodsItem.vue';
import { ref,onMounted } from 'vue';
import { useRoute } from 'vue-router';

//获取面包屑导航参数
const categoryData = ref({})
const route = useRoute()
const getCategoryFilterData = async () => {
    const res = await getCategoryFilterAPI(route.params.id)
    categoryData.value = res.result
}
onMounted(() => {
    getCategoryFilterData()
})

//获取基础列表数据
const Goodslist = ref([])
const reqdata = ref({
    categoryId: route.params.id,
    page:1,
    pageSize: 20,
    sortField: 'publishTime',
})
const getGoodsList = async () => {
    const res = await getSubCategoryAPI(reqdata.value)
    Goodslist.value = res.result.items
}
onMounted(() => {
    getGoodsList()
})
//tab切换回调.tab点击时，reqdata.sortField在v-model的作用下已被更改，此时直接重新发请求
const tabChange = (index) => {
    reqdata.value.page = 1
    getGoodsList()
}
//无限滚动加载
const disabled = ref(false)
const loadMore = async() => {
    reqdata.value.page++
    const res = await getSubCategoryAPI(reqdata.value)  //获取新数据
    Goodslist.value = Goodslist.value.concat(res.result.items) //新老数据拼接
    //加载完毕停止监听
    if (res.result.items.length == 0) {
        disabled.value = true 
    }
}
</script>

<template>
  <div class="container ">
    <!-- 面包屑 -->
    <div class="bread-container">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: `/category/${categoryData.parentId}` }">{{ categoryData.parentName }}
        </el-breadcrumb-item>
        <el-breadcrumb-item>{{ categoryData.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="sub-container">
      <el-tabs v-model="reqdata.sortField" @tab-change="tabChange">
        <el-tab-pane label="最新商品" name="publishTime"></el-tab-pane>
        <el-tab-pane label="最高人气" name="orderNum"></el-tab-pane>
        <el-tab-pane label="评论最多" name="evaluateNum"></el-tab-pane>
      </el-tabs>
      <div class="body" v-infinite-scroll="loadMore" :infinite-scroll-disabled="disabled">
         <!-- 商品列表-->
          <GoodsItem v-for="goods in Goodslist" :key="goods.id" :good="goods"></GoodsItem>
      </div>
    </div>
  </div>

</template>



<style lang="scss" scoped>
.bread-container {
  padding: 25px 0;
  color: #666;
}

.sub-container {
  padding: 20px 10px;
  background-color: #fff;

  .body {
    display: flex;
    flex-wrap: wrap;
    padding: 0 10px;
  }

  .goods-item {
    display: block;
    width: 220px;
    margin-right: 20px;
    padding: 20px 30px;
    text-align: center;

    img {
      width: 160px;
      height: 160px;
    }

    p {
      padding-top: 10px;
    }

    .name {
      font-size: 16px;
    }

    .desc {
      color: #999;
      height: 29px;
    }

    .price {
      color: $priceColor;
      font-size: 20px;
    }
  }

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }


}
</style>
