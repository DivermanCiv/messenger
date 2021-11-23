
const i18n = require("../i18n.config");

function isUserLogged(req, res, next){
    if (!req.user) {
        return res.status(401).send({message: i18n.t('unauthorized')})
    }

}

module.exports = {isUserLogged}