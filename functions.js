const faker = require('faker')

function createRoomName(user_id) {
    const beginning = [
        faker.hacker.ingverb(),
        faker.hacker.verb(),
        faker.name.prefix(),
        faker.random.boolean(),
        faker.name.firstName(),
        faker.commerce.color(),
        faker.company.bsAdjective(),
        faker.company.catchPhraseAdjective(),
        faker.commerce.productAdjective()
    ]

    const end = [
        faker.hacker.noun(),
        faker.finance.currencyName(),
        faker.company.bsNoun(),
        faker.company.catchPhraseNoun(),
        faker.commerce.department(),
        faker.commerce.productMaterial(),
        faker.name.suffix(),
        faker.company.catchPhraseNoun(),
        faker.company.catchPhraseDescriptor()
    ]

    const i = Math.floor(Math.random() * 9)
    //const randomNum = Math.floor(Math.random()*1000)

    // remove white space/replace with '-' and '.'/replace with ''
    const chatRoomName = `${beginning[i].toString().replace(/\s/g,"-").replace(/\./g,"")
                        }-${end[i].toString().replace(/\s/g,"-").replace(/\./g,"")
                        }-`
        return chatRoomName
}

module.exports = {
    createRoomName
}