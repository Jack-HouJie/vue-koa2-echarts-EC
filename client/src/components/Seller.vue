
<template>
  <!-- 2.1.2 -->
  <div class="com-container">
    <div class="com-chart"
         ref="sellerRef">
    </div>
  </div>
</template>

<script>
// 2.1.2商家销量统计横向柱状图
// import { getSellerData } from '@/api/seller'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      chartInstance: null,
      allData: null, // 服务器返回的数据 2.1.3
      currentPage: 1, // 当前页 2.1.4
      pageSize: 5, // 页容量 2.1.4
      totalPage: 0, // 总页数 2.1.4
      timer: null // 定时器 2.1.4.2
    }
  },
  computed: {
    ...mapGetters(['getTheme'])
  },
  watch: {
    getTheme () {
      this.chartInstance.dispose() // 销毁之前的echarts实例
      this.initChart() // 重新创建echarts实例
      this.screenAdapter() // 重新进行屏幕适配
      this.updateChart() // 重新绘制图表
    }
  },
  created () {
    this.$socket.registerCallBack('sellerData', this.getData)
  },
  mounted () {
    // 2.1.3 挂载后初始化Echarts实例
    this.initChart()
    // this.getData()
    this.$socket.send({
      action: 'getData',
      chartName: 'seller',
      socketType: 'sellerData',
      value: ''
    })
    // this.getData()
    // 2.1.7
    window.addEventListener('resize', this.screenAdapter)
    // 2.1.7初始化屏幕适配
    this.screenAdapter()
  },
  destroyed () {
    // 组件销毁时销毁监听器防止内存泄漏
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unRegisterCallBack('sellerData')
    // 清除定时器
    clearInterval(this.timer)
  },
  methods: {
    // 2.1.3 初始化Echarts图表
    initChart () {
      // 使用全局Echarts对象init方法
      // 通过ref拿到DOM元素作为参数
      // 使用getTheme作为参数设置属性
      this.chartInstance = this.$echarts.init(
        this.$refs.sellerRef, // 图表DOM
        this.getTheme // 图表主题
      )
      // 2.1.4对图表初始化配置的控制
      const initOption = {
        // 2.1.5 设置图标UI
        title: {
          text: '▎商家销售统计',
          left: 20,
          top: 20
        },
        grid: {
          top: '20%',
          left: '3%',
          right: '6%',
          bottom: '3%',
          containLabel: true // 距离是包含坐标轴上的文字
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            z: 0,
            lineStyle: {
              width: 76,
              color: '#2D3443'
            }
          }
        },
        series: [
          {
            type: 'bar',
            label: {
              show: true,
              position: 'right',
              textStyle: {
                color: 'white'
              }
            },
            itemStyle: {
              // 指明颜色渐变的方向
              // 指明不同百分比之下的颜色值
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 1, [
                // 0%状态下的颜色值
                {
                  offset: 0,
                  color: '#5052EE'
                },
                // 100%状态下的颜色值
                {
                  offset: 1,
                  color: '#AB6EE5'
                }
              ])
            }
          }
        ]
      }
      this.chartInstance.setOption(initOption)
      // 2.1.4.2 移入时不再更新，移出时更新
      this.chartInstance.on('mouseover', () => {
        // 用户鼠标点击时不再更新页数
        clearInterval(this.timer)
      })
      this.chartInstance.on('mouseout', () => {
        // 鼠标移出重新启动更新页数定时器
        this.startInterval()
      })
    },
    // 2.1.3 获取服务器数据
    // async getData () {
    getData (res) {
      // const res = await getSellerData()
      // this.allData = res.data
      this.allData = res
      // 2.1.4从小到大排序
      this.allData.sort((a, b) => a.value - b.value)
      // 2.1.4计算总页码
      this.totalPage =
        this.allData.length % 5 === 0
          ? this.allData.length / 5
          : this.allData.length / 5 + 1
      // 更新图表
      this.updateChart()
      // 开启更新页数定时器
      this.startInterval()
    },
    // 2.1.3 更新图表
    updateChart () {
      // 2.1.4 获取当前页数据
      const start = (this.currentPage - 1) * this.pageSize
      const end = this.currentPage * this.pageSize
      const showData = this.allData.slice(start, end)

      // 2.1.3商家名（类目）
      const sellerNames = showData.map(item => item.name)
      // 2.1.3数据值
      const sellerValues = showData.map(item => item.value)
      // 2.1.3 数据配置
      const dataOption = {
        // 柱状图设置
        yAxis: {
          data: sellerNames
        },
        series: [
          {
            data: sellerValues
          }
        ]
      }

      this.chartInstance.setOption(dataOption)
    },
    // 2.1.4.2开启定时器
    startInterval () {
      // 防抖
      if (this.timer) {
        clearInterval(this.timer)
      }

      this.timer = setInterval(() => {
        this.currentPage++
        // 最后一页之后设为第一页
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1
        }
        // 根据当前页更新图表数据
        this.updateChart()
      }, 3000)
    },
    // 2.1.7 屏幕的适配（resize事件监听器）
    screenAdapter () {
      // 计算标题文字大小
      const titleFontSize = (this.$refs.sellerRef.offsetWidth / 100) * 3.6
      // 2.1.7 分辨率适配配置
      const adapterOption = {
        title: {
          textStyle: {
            // 标题文字大小
            fontSize: titleFontSize
          }
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize + 5
            }
          }
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0] // 圆角
            }
          }
        ]
      }

      this.chartInstance.setOption(adapterOption)
      // 手动的调用图表对象的resize，才能产生效果
      this.chartInstance.resize()
    }
  }
}
</script>
