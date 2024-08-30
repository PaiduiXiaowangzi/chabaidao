/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.post('/api/admin/register',controller.admininfo.adminRegister)
  router.post('/api/admin/login',controller.admininfo.adminLogin)
  router.post('/api/admin/uploadFile',controller.upload.uploadFile)
};
