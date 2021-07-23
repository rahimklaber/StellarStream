const fetch = require("node-fetch")
module.exports = (body) => {
    const {hash} = body
    return fetch(`https://untitled-yj18y9ktwv91.runkit.sh/${hash}`)
        .then((res) => {
            if (res.ok)
                return res.text()
            throw res
        })
}