// index.js
const api = require('../../utils/api')
const languageManager = require('../../utils/language')

Page({
  data: {
    // 语言相关
    currentLanguage: 'zh-CN',
    texts: {},
    
    // 分类相关
    categories: [],
    selectedCategoryId: null,
    categoriesLoading: false,
    categoriesError: false,
    
    // 产品相关
    products: [],
    productsLoading: false,
    productsError: false
  },

  onLoad() {
    this.initLanguage()
    this.loadCategories()
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
      title: texts.appTitle
    })
  },

  /**
   * 切换语言
   */
  toggleLanguage() {
    const newLanguage = languageManager.toggleLanguage()
    const texts = languageManager.getAllTexts(newLanguage)
    
    this.setData({
      currentLanguage: newLanguage,
      texts
    })

    // 更新导航栏标题
    wx.setNavigationBarTitle({
      title: texts.appTitle
    })

    // 重新加载数据
    this.loadCategories()
    if (this.data.selectedCategoryId) {
      this.loadProducts()
    }
  },

  /**
   * 语言开关变化事件
   */
  onLanguageChange(e) {
    // 这个方法主要是为了处理开关的UI变化
    // 实际语言切换通过toggleLanguage处理
  },

  /**
   * 加载分类列表
   */
  async loadCategories() {
    this.setData({
      categoriesLoading: true,
      categoriesError: false
    })

    try {
      const categories = await api.getCategories(this.data.currentLanguage)
      this.setData({
        categories,
        categoriesLoading: false
      })
    } catch (error) {
      console.error('加载分类失败:', error)
      this.setData({
        categoriesLoading: false,
        categoriesError: true
      })
      
      wx.showToast({
        title: this.data.texts.error,
        icon: 'none'
      })
    }
  },

  /**
   * 选择分类
   */
  selectCategory(e) {
    const category = e.currentTarget.dataset.category
    
    this.setData({
      selectedCategoryId: category.id
    })
    
    this.loadProducts()
  },

  /**
   * 加载产品列表
   */
  async loadProducts() {
    if (!this.data.selectedCategoryId) return

    this.setData({
      productsLoading: true,
      productsError: false,
      products: []
    })

    try {
      const products = await api.getProducts(
        this.data.selectedCategoryId, 
        this.data.currentLanguage
      )
      
      this.setData({
        products,
        productsLoading: false
      })
    } catch (error) {
      console.error('加载产品失败:', error)
      this.setData({
        productsLoading: false,
        productsError: true
      })
      
      wx.showToast({
        title: this.data.texts.error,
        icon: 'none'
      })
    }
  },

  /**
   * 查看产品详情
   */
  viewProduct(e) {
    const product = e.currentTarget.dataset.product
    
    wx.navigateTo({
      url: `/pages/product-detail/product-detail?id=${product.id}&lang=${this.data.currentLanguage}`
    })
  },

  /**
   * 页面显示时
   */
  onShow() {
    // 检查语言是否有变化
    const currentLanguage = languageManager.getCurrentLanguage()
    if (currentLanguage !== this.data.currentLanguage) {
      this.initLanguage()
      this.loadCategories()
      if (this.data.selectedCategoryId) {
        this.loadProducts()
      }
    }
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.loadCategories()
    if (this.data.selectedCategoryId) {
      this.loadProducts()
    }
    wx.stopPullDownRefresh()
  }
})
