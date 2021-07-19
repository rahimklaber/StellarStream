/**
 * Todo: rename file to albedo.ts or soemthing.
 */

import {writable} from "svelte/store"
import Home from "./Home.svelte"
import albedo from "@albedo-link/intent"
import type { Account } from "stellar-sdk"
import { server } from "./stellar"
import { serverUrl } from "./backend"
let albedoAddress =""
let _account : Account
export const store = writable(
    Home
)

export async function publicKey(): Promise<string>{
    if(albedoAddress.length > 10){
        return albedoAddress
    }
    else {
        albedoAddress = (await albedo.publicKey()).pubkey
        return albedoAddress
    }

}

export async function account() : Promise<Account>{
    if(_account != undefined){
        return _account
    }
    const account_id = await publicKey()
    _account = await server.loadAccount(account_id)

    return _account
}

export async function logOut() {
    albedoAddress = ""
    _account = undefined
}
/**
 * sign a transactionw ith albedo
 * 
 * @param txXdr transaction in xdr base64 format to sign
 * @returns base64 xdr of signed transaction 
 */
export async function signWithAlbedo(txXdr : string): Promise<string> {
    const signedXdr = await albedo.tx({
        xdr : txXdr
    })  
    return signedXdr.signed_envelope_xdr
}