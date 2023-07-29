
const service = require('../service/label.service');
const verifyLabelExists = async (ctx, next) => {
  // 1.取出要添加的所有的标签
  const { labels } = ctx.request.body;
  const newLabels = [];
  for(let name of labels) {
    const labelResult = await service.getLabelByName(name);
    const label = { name };
    if (!labelResult) {
      const result = await service.create(name);
      label.id = result.insertId;
    } else {
      label.id = labelResult.id;
    }
    newLabels.push(label);
  }
  ctx.labels = newLabels;
  await next();
}

module.exports = {
  verifyLabelExists
}
