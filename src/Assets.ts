/**
 * Assets we support.
 * Todo: ability to use any asset
 */
class Asset{
    name: string
    issuer: string

    constructor(name: string, issuer: string) {
        this.name=name
        this.issuer=issuer
    }
    public toString() : string{
        return name
    }
}
export const assets =  [new Asset("USDC","GC5W3BH2MQRQK2H4A6LP3SXDSAAY2W2W64OWKKVNQIAOVWSAHFDEUSDC")]

