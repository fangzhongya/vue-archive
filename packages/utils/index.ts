import { parse as commentParserParse } from 'comment-parser';

import {
    init as esModuleLexerInit,
    parse as esModuleLexerParse,
    type ImportSpecifier,
} from 'es-module-lexer';

export type Spec = {
    tag: string;
    name: string;
    default?: string;
    type: string;
    optional: boolean;
    description: string;
    selectable: string;
    problems?: unknown;
    source?: unknown;
} & {
    [key: string]: string;
};
export interface Block {
    description: string;
    tags: Spec[];
    source: unknown;
    problems: unknown;
}

export interface Specs {
    [key: string]: Spec;
}

interface Descriptions {
    descriptions: string;
}

export type SpecObjs = Descriptions & Specs;

export function getTextNotes(text: string) {
    if (text) {
        return commentParserParse(text) as Block[];
    }
}
export function getTextImport(
    jstext: string,
): Promise<readonly ImportSpecifier[]> {
    return new Promise(async (resolve) => {
        await esModuleLexerInit;
        const [importss] = esModuleLexerParse(jstext);
        resolve(importss);
    });
}
export function copyCode(text: string) {
    navigator.clipboard.writeText(text);
}
