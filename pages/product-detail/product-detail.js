// product-detail.js
const api = require('../../utils/api')
const languageManager = require('../../utils/language')

Page({
  data: {
    // 语言相关
    currentLanguage: 'zh-CN',
    texts: {},
    
    // 产品相关
    product: null,
    productId: null,
    loading: false,
    error: false,
    
    // 图片预览相关
    imageUrls: []
  },

  onLoad(options) {
    const { id, lang } = options
    
    if (!id) {
      wx.showToast({
        title: '产品ID不能为空',
        icon: 'none'
      })
      return
    }

    this.setData({
      productId: parseInt(id)
    })

    // 设置语言
    if (lang) {
      languageManager.setCurrentLanguage(lang)
    }
    
    this.initLanguage()
    this.loadProduct()
  },

  /**
   * 初始化语言设置
   */
  initLanguage() {
    const currentLanguage = languageManager.getCurrentLanguage()
    const texts = languageManager.getAllTexts(currentLanguage)
    
    this.setData({
      currentLanguage,
      texts
    })

    // 更新导航栏标题
    wx.setNavigationBarTitle({
      title: texts.productName
    })
  },

  /**
   * 加载产品详情
   */
  async loadProduct() {
    if (!this.data.productId) return

    this.setData({
      loading: true,
      error: false
    })

    try {
      const product = await api.getProductDetail(
        this.data.productId,
        this.data.currentLanguage
      )
      
      // 提取图片URL用于预览
      const imageUrls = product.media
        .filter(item => item.type === 'image')
        .map(item => item.url)
      
      this.setData({
        product,
        imageUrls,
        loading: false
      })

      // 更新导航栏标题为产品名称
      wx.setNavigationBarTitle({
        title: product.name
      })
      
    } catch (error) {
      console.error('加载产品详情失败:', error)
      this.setData({
        loading: false,
        error: true
      })
      
      wx.showToast({
        title: this.data.texts.error,
        icon: 'none'
      })
    }
  },

  /**
   * 预览图片
   */
  previewImage(e) {
    const { url, urls } = e.currentTarget.dataset
    
    wx.previewImage({
      current: url,
      urls: urls || [url]
    })
  },

  /**
   * 页面分享
   */
  onShareAppMessage() {
    const { product } = this.data
    
    if (product) {
      return {
        title: product.name,
        path: `/pages/product-detail/product-detail?id=${product.id}&lang=${this.data.currentLanguage}`,
        imageUrl: product.media && product.media.length > 0 ? product.media[0].url : ''
      }
    }
    
    return {
      title: this.data.texts.appTitle,
      path: `/pages/product-detail/product-detail?id=${this.data.productId}&lang=${this.data.currentLanguage}`
    }
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.loadProduct()
    wx.stopPullDownRefresh()
  }
}) 