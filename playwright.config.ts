import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./tests/e2e',fullyParallel:false,workers:1,use:{baseURL:process.env.PEM_TEST_URL||'http://localhost:4180',browserName:'chromium',channel:process.env.CI?undefined:'msedge'},webServer:process.env.CI?{command:'npm start',url:'http://localhost:4180',reuseExistingServer:false}:undefined});
