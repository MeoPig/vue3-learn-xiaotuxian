//定义懒加载插件
import { useIntersectionObserver } from '@vueuse/core'

export const lazyPlugin = {
    install(app){
        app.directive('img-lazy', {
            mounted(el,binding) {
                //el:指令绑定的哪个元素  Img
                //binding: bingding.value 指令等于
                const { stop } = useIntersectionObserver(
                    el,
                    ([{ isIntersecting }]) => {
                      if(isIntersecting){
                        //进入视口
                        el.src = binding.value
                        stop()
                      }
                    },
                  )
            },
          })
    }
}