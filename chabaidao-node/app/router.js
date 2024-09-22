/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

// -------------------后台管理api接口---------------------
  //注册
  router.post('/api/admin/register',controller.admininfo.adminRegister)
    //登录
  router.post('/api/admin/login',controller.admininfo.adminLogin)
  //上产文件
  router.post('/api/admin/uploadFile',controller.upload.uploadFile)
  //登录更新店铺logo
  router.post('/api/admin/upload-logo',app.middleware.jwt(),controller.admininfo.uploadLogo)
  //更新店铺名称
  router.post('/api/admin/upload-tradeName',app.middleware.jwt(),controller.admininfo.uploadTradeName)
  //更新店铺介绍
  router.post('/api/admin/upload-shopintroduction',app.middleware.jwt(),controller.admininfo.uploadShopIntroduction)
  //更新营业时间
  router.post('/api/admin/upload-businesshours',app.middleware.jwt(),controller.admininfo.uploadBusinessHours)
  // 更新外卖起送价
  router.post('/api/admin/upload-initialprice',app.middleware.jwt(),controller.admininfo.uploadInitialprice)
  // 更新地址
  router.post('/api/admin/upload-address', app.middleware.jwt(), controller.admininfo.uploadAddress)
  // 新增商品类目
  router.post('/api/admin/add-category', app.middleware.jwt(), controller.category.addCategory)
  // 获取商品类目
  router.get('/api/admin/get-category', app.middleware.jwt(), controller.category.getCategory)
  // 删除商品类目
  router.get('/api/admin/delete-category',app.middleware.jwt(),controller.category.deleteCategory)
  // 获取所有商品类目
  router.get('/api/admin/all-category',app.middleware.jwt(),controller.category.allCategory)
  // 提交新增商品
  router.post('/api/admin/add-goods', app.middleware.jwt(), controller.goods.addGoods)
  // 获取商品数据
  router.get('/api/admin/get-goods', app.middleware.jwt(), controller.goods.getGoods)
  // 删除商品
  router.get('/api/admin/delete-goods', app.middleware.jwt(), controller.goods.deleteGoods)

  // 提交推荐商品
  router.post('/api/admin/add-recommend', app.middleware.jwt(), controller.recommendGoods.addRecommend)
  // 获取推荐商品列表
  router.get('/api/admin/get-recommend', app.middleware.jwt(), controller.recommendGoods.getRecommend)
  // 删除推荐商品
  router.get('/api/admin/delete-recommend', app.middleware.jwt(), controller.recommendGoods.deleteRecommend)


// ------------------小程序接口------------------
 
  // 获取小程序首页轮播数据
  router.get('/api/wx/get-swiper', controller.wxHomepage.getSwiper)
  // 小程序获取商家信息
  router.get('/api/wx/get-merchantinfo', controller.wxChooseAmenu.getMerchantInfo)
  //  计算用户和商家之间的距离
  router.get('/api/wx/distance-calculator', controller.wxChooseAmenu.distanceCalculator)
  //  获取分类和所有商品数据
  router.get('/api/wx/all-goods', controller.wxChooseAmenu.allGoods)
  //  获取某个商品的sku列表
  router.get('/api/wx/goods-sku-list', controller.wxChooseAmenu.goodsSkuList)
  //  搜索商品
  router.get('/api/wx/search-goods', controller.wxChooseAmenu.searchGoods)
};
