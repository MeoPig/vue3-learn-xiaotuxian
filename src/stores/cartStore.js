// 封装购物车模块
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useUserStore } from './userStore'
import { insertCartAPI, delCartAPI, findNewCartListAPI, mergeCartAPI } from '@/apis/cart'

export const useCartStore = defineStore('cart', () => {
  const userStore = useUserStore()
  const isLogin = computed(() => userStore.userInfo.token)

  // 1. 定义state - cartList
  const cartList = ref([])
  const updateNewList = async() => {
    const res = await findNewCartListAPI()
    cartList.value = res.result
  }
  // 2. 购物车添加商品
  const addCart = async(goods) => {
    // 添加购物车操作  已添加过 - count + 1；没有添加过 - 直接push；思路：通过匹配传递过来的商品对象中的skuId能不能在cartList中找到，找到了就是添加过
    const { skuId ,count } = goods
    if(isLogin.value){ 
      //已登录之后的加入购物车逻辑
      await insertCartAPI({ skuId ,count })
      updateNewList()
    } else{
     const item = cartList.value.find((item) => goods.skuId === item.skuId)
    if (item) {
      // 找到了
      item.count++
    } else {
      // 没找到
      cartList.value.push(goods)
    } 
    }
  }
  // 3. 购物车删除商品
  const delCart = async (skuId) => {
    if(isLogin.value){
      await delCartAPI([skuId])
      updateNewList()
    }else{
    // 思路：1. 找到要删除项的下标值 - splice  2. 使用数组的过滤方法 - filter
    const idx = cartList.value.findIndex((item) => skuId === item.skuId)
    cartList.value.splice(idx, 1)
    }

}
  //清除购物车
  const clearCart = async () => {
    // if(isLogin.value){
    //   const ids = cartList.value.map((item) => item.skuId)
    //   await delCartAPI(ids)
    //   updateNewList()
    // }else{
      cartList.value = []
    // } 
  }
  // 4. 头部购物车统计价格
    //(1).总的数量，所有项count之和
  const allCount = computed(() => cartList.value.reduce((a, c) => a + c.count, 0))
    //(2).总价，所有项count*price之和
  const allPrice = computed(() => cartList.value.reduce((a, c) => a + c.count * c.price, 0))
  
  // 5.单选功能
  const singleCheck = (skuId, selected) => {
    // 通过skuId找到要修改的那一项 然后把它的selected修改为传过来的selected
    const item = cartList.value.find((item) => item.skuId === skuId)
    item.selected = selected
  }

  // 6.全选功能
  const isAll = computed(() => cartList.value.every((item) => item.selected))
  const allCheck = (selected) => { //把cartList中的每一项selected都设置为全选框状态
    cartList.value.forEach((item) => item.selected = selected)
  }
  // 7.列表购物车统计价格和数量
  const selectedCount = computed(() => cartList.value.filter((item) => item.selected).reduce((a, c) => a + c.count, 0))
  const selectedPrice = computed(() => cartList.value.filter((item) => item.selected).reduce((a, c) => a + c.count * c.price, 0))
  
  return {
    cartList,
    allCount,
    allPrice,
    isAll,
    selectedCount,
    selectedPrice, 
    clearCart,
    singleCheck,
    allCheck,
    addCart,
    delCart
  }
}, {
  persist: true,
})
