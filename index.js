const app = require('./server/app')
const config = require('./server/utils/config')
const logger = require('./server/utils/logger')

const PORT = config.PORT
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})