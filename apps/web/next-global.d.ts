// Extend the NodeJS namespace with Next.js-defined properties
declare namespace NodeJS {
    interface ProcessEnv {
        readonly AdminObjectId: string;
        readonly MONGODB_URI: string;
        readonly NEXTAUTH_URL: string;
        readonly GITHUB_ID: string;
        readonly GITHUB_SECRET: string;
    }
}