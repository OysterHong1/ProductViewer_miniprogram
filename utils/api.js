// API服务模块
const BASE_URL = 'https://kejieweifa.store'

/**
 * 封装网络请求
 */
function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URL + url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        ...options.header
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          reject(new Error(res.data.error || '请求失败'))
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

/**
 * API接口
 */
const api = {
  /**
   * 获取公司信息
   * @param {string} lang 语言代码 zh-CN | en-US
   */
  getCompanyInfo(lang = 'zh-CN') {
    return request('/api/company', {
      data: { lang }
    })
  },

  /**
   * 获取分类列表
   * @param {string} lang 语言代码
   * @param {number} parentId 父分类ID，不传获取顶级分类
   */
  getCategories(lang = 'zh-CN', parentId = null) {
    const data = { lang }
    if (parentId !== null) {
      data.parentId = parentId
    }
    return request('/api/categories', {
      data
    })
  },

  /**
   * 获取产品列表
   * @param {number} categoryId 分类ID
   * @param {string} lang 语言代码
   */
  getProducts(categoryId, lang = 'zh-CN') {
    return request('/api/products', {
      data: { categoryId, lang }
    })
  },

  /**
   * 获取产品详情
   * @param {number} productId 产品ID
   * @param {string} lang 语言代码
   */
  getProductDetail(productId, lang = 'zh-CN') {
    return request(`/api/product/${productId}`, {
      data: { lang }
    })
  }
}

module.exports = api 