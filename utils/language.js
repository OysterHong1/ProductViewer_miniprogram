// 语言管理模块
const LANGUAGE_KEY = 'app_language'

// 语言文本配置
const texts = {
  'zh-CN': {
    appTitle: '产品查看器',
    categories: '产品分类',
    productName: '产品名',
    productPrice: '价格',
    productDescription: '产品详情',
    loading: '加载中...',
    error: '加载失败',
    retry: '重试',
    noProducts: '暂无产品',
    noCategories: '暂无分类',
    backToList: '返回列表',
    currency: '¥'
  },
  'en-US': {
    appTitle: 'Product Viewer',
    categories: 'Categories',
    productName: 'Product Name',
    productPrice: 'Price',
    productDescription: 'Product Details',
    loading: 'Loading...',
    error: 'Failed to load',
    retry: 'Retry',
    noProducts: 'No products',
    noCategories: 'No categories',
    backToList: 'Back to List',
    currency: '$'
  }
}

/**
 * 语言管理器
 */
const languageManager = {
  /**
   * 获取当前语言
   */
  getCurrentLanguage() {
    return wx.getStorageSync(LANGUAGE_KEY) || 'zh-CN'
  },

  /**
   * 设置当前语言
   * @param {string} lang 语言代码
   */
  setCurrentLanguage(lang) {
    wx.setStorageSync(LANGUAGE_KEY, lang)
  },

  /**
   * 获取文本
   * @param {string} key 文本键
   * @param {string} lang 语言代码，不传则使用当前语言
   */
  getText(key, lang = null) {
    const currentLang = lang || this.getCurrentLanguage()
    return texts[currentLang] && texts[currentLang][key] || key
  },

  /**
   * 获取所有文本
   * @param {string} lang 语言代码，不传则使用当前语言
   */
  getAllTexts(lang = null) {
    const currentLang = lang || this.getCurrentLanguage()
    return texts[currentLang] || texts['zh-CN']
  },

  /**
   * 切换语言
   */
  toggleLanguage() {
    const currentLang = this.getCurrentLanguage()
    const newLang = currentLang === 'zh-CN' ? 'en-US' : 'zh-CN'
    this.setCurrentLanguage(newLang)
    return newLang
  }
}

module.exports = languageManager 