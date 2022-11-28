// Extend the NodeJS namespace with Next.js-defined properties
declare namespace NodeJS {
    interface ProcessEnv {
        readonly GITHUB_ID: string;
        readonly GITHUB_SECRET: string;
    }
}