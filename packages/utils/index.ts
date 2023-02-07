import { parse as commentParserParse } from 'comment-parser';

import { parse as esModuleLexerParse } from 'es-module-lexer';

export interface Spec {
    tag: string;
    name: string;
    default?: string;
    type: string;
    optional: boolean;
    description: string;
    selectable: string;
    problems: any;
    source: any;
}
export interface Block {
    description: string;
    tags: Spec[];
    source: any;
    problems: any;
}

export function getTextNotes(text: string) {
    if (text) {
        return commentParserParse(text) as Block[];
    }
}
export function getTextImport(jstext: string) {
    const [importss] = esModuleLexerParse(jstext);
    return importss;
}
export function copyCode(text: string) {
    navigator.clipboard.writeText(text);
}
