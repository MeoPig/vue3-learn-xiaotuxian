<script setup>
import HomePanel from './HomePanel.vue'
import { getHotAPI } from '@/apis/home'
import { onMounted,ref } from 'vue'

const newList = ref([])
const getHotList = async () => {
  const res = await getHotAPI()
  newList.value = res.result
}
onMounted(() => {
    getHotList()
})

</script>

<template>
  <HomePanel title="人气推荐" subTitle="人气爆款 不容错过">
    <!-- 下面是插槽主体内容模版 -->
    <ul class="goods-list">
        <li v-for="item in newList" :key="item.id">
        <RouterLink to="/">
            <img v-img-lazy="item.picture" alt="" />
            <p class="name">{{ item.title }}</p>
            <p class="price">{{ item.alt }}</p>
        </RouterLink>
        </li>
    </ul>
  </HomePanel>
  
 
</template>


<style scoped lang='scss'>
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 406px;

  li {
    width: 306px;
    height: 406px;

    background: #ffffff;
    transition: all .5s;

    &:hover {
      transform: translate3d(0, -3px, 0);
      box-shadow: 0 3px 8px rgb(0 0 0 / 20%);
    }

    img {
      width: 306px;
      height: 306px;
    }

    p {
      font-size: 20px;
      padding-top: 12px;
      text-align: center;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    .price {
      font-size: 18px;
    //   color: $priceColor;
    }
  }
}
</style>
