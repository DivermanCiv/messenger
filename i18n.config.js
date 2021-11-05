const i18next = require("i18next")

i18next.init({
    lng: 'fr',
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