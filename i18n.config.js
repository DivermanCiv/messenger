const i18next = require("i18next")
const {language} = require("./config")

i18next.init({
    lng: language,
    resources: {
        fr:{
            translation: require('./locales/fr.json')
        },
        en: {
            translation: require('./locales/en.json')
        }
    }
    });

module.exports = i18next