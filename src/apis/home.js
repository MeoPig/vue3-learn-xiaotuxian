import httpInstance from "@/utils/http";
//根据distributionSite获取banner轮播图数据
export function getBannerAPI(params = {}){
  const { distributionSite = '1' } = params
    return httpInstance({
        url: '/home/banner',
        params:{
            distributionSite
        }
    })
}

/**
 * @description: 获取新鲜好物
 * @param {*}
 * @return {*}
 */
export const getNewAPI = () => {
    return httpInstance({
      url:'/home/new'
    })
  }

/**
 * @description: 获取人气推荐
 * @param {*}
 * @return {*}
 */
export const getHotAPI = () => {
    return httpInstance({
      url:'/home/hot'
    })
  }

  /**
 * @description: 获取所有商品模块
 * @param {*}
 * @return {*}
 */
export const getGoodsAPI = () => {
  return httpInstance({
    url: '/home/goods'
  })
}
