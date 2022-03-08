import type { Plugin } from "vite";

interface Options {
    swaggerUrl: string;
    output?: string;
    prettierPath?: string;
}

export type UserOptions = Options;
export interface ResolvedOptions extends Options {
    output: string;
}

export type ExportPlugin = Required<Pick<Plugin, "name" | "enforce" | "apply">>;

export interface SwaggerSource {
    name: string;
    url: string;
    swaggerVersion: string;
    location: string;
}
