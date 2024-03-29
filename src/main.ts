import App from './App.svelte';
import {router} from "./navigo"
import {store} from "./store"
import Home from "./Home.svelte"
import Streams from "./Streams.svelte"
import CreateStreams from "./CreateStream.svelte"
import ManageStreams from "./ManageStreams.svelte"
const app = new App({
    target: document.body,
});
router.on(
    {
        "/": function () {
            store.set(Home)
        },
        "/createstreams": function () {
            store.set(CreateStreams)
        },
        "/streams": function () {
            store.set(Streams)
        },
        "/managestreams": function () {
            store.set(ManageStreams)
        },


    }
).resolve()
export default app;