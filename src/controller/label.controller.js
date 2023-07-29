const service = require('../service/label.service')
class LabelController {
  async create(ctx, next) {
    const { name } = ctx.request.body;
    const result = await service.create(name)
    ctx.body = name
  }
  
  async list(ctx, next) {
    const result = await service.getLabels('0', '100');
    ctx.body = {
      code: 200,
      message: 'success',
      data: result
    }
  }
}

module.exports = new LabelController();