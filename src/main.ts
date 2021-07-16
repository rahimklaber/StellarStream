import App from './App.svelte';
import {router} from "./navigo"
import {store} from "./store"
import Home from "./Home.svelte"

const app = new App({
    target: document.body,
});
router.on(
    {
        "/": function () {
            store.set(Home)
        }

    }
).resolve()
export default app;