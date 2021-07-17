import {writable} from "svelte/store"
import Home from "./Home.svelte"
import albedo from "@albedo-link/intent"
let albedoAddress =""
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

export async function logOut() {
    albedoAddress = ""
}