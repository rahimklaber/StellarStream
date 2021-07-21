<style global lang="scss">

</style>

<script lang="ts">
    import {logOut, publicKey, store} from "./store"
    import {onMount} from "svelte";
    import Home from "./Home.svelte"
    import {router} from "./navigo"
    import {AppBar, Button, MaterialApp,Divider} from 'svelte-materialify';
    import {shortenAddress} from "./utils";
    import CreateStream from "./CreateStream.svelte"
    import Streams from "./Streams.svelte"


    let page = Home

    store.subscribe(value => {
            page = value
        }
    )
    onMount(async () => router.updatePageLinks())


    const theme = "dark"
    let loggedIn: boolean = false
    let addr: string


    export async function connectButtonOnclick() {
        if (loggedIn) {
            addr = ""
            loggedIn = false
            await logOut()
        } else {
            addr = await publicKey()
            loggedIn = true
        }

    }



</script>

<MaterialApp {theme} >
    <AppBar >
        <div slot="title">
            <Button  on:click={()=>router.navigate("/")}> Stellar Stream </Button>
        </div>

        <Divider vertical inset class="ml-4"/>
        <Button data-navigo on:click={() => router.navigate("/createstreams")}>Create Streams</Button>
        <Button data-navigo on:click={() => router.navigate("/streams")}>Claim</Button>
        <Button data-navigo on:click={() => router.navigate("/managestreams")}>Manage Streams</Button>
        <div style="flex-grow:1"/>

        <Button on:click={connectButtonOnclick}>
            {#if loggedIn}
                 {shortenAddress(addr)}
            {:else}
                connect wallet
            {/if}
        </Button>

    </AppBar>
    <div style="display:flex;justify-content: center;margin-top: 10px;">
        <svelte:component this={page}/>
    </div>

</MaterialApp>