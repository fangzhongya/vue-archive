import { init } from './router/index';
import { userConfig } from './config';
import type { Config } from './config';
import type { App } from 'vue';
import type { Router } from 'vue-router';

export function defineConfig(config: Config) {
    return userConfig(config);
}

// import '../archive.config';

export default {
    install: function (app: App, router: Router) {
        init(router);
    },
};
