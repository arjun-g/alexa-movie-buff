var Logger = require('le_node')
  , logger = new Logger({ token: process.env.LE_TOKEN })

module.exports = {
    log: function(data){
        console.log(data)
        logger.debug(data)
    },
    error: function(err){
        console.log(err)
        logger.err(err)
    },
    exit: function(){
        logger.notice({ type: 'server', event: 'shutdown' });
        logger.once('buffer drain', () => {
            logger.closeConnection();
        });
    }
}