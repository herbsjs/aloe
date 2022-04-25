const { Err } = require("@herbsjs/herbs")
const { when } = require("../when")

const builtinWhen = () => {
  const instance =
    when(async (ctx) => {
      const injection = ctx.injection
      const uc = ctx.usecase(injection)

      const hasAccess = await uc.authorize(ctx.user)

      if (hasAccess === false) {
        ctx.response = Err.permissionDenied()
        return
      }

      const request = ctx.request
      ctx.response = await uc.run(request)
    })

  instance.builtin = true
  return instance
}

module.exports.builtinWhen = builtinWhen