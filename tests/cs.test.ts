import { test, expect } from 'vitest';

test('../class/com', () => {
    console.log(
        'setCss',
        setCss(
            `@charset "utf-8";

       /*common*/
       
       .gap {
           height: 0.37037rem;
       }
       
       .mask {
           position: fixed;
           left: 0;
           top: 0;
           right: 0;
           bottom: 0;
           background: rgba(0, 0, 0, .4);
           z-index: 1000;
           display: none;
       }
       
       
       /*page*/
       
       .header {
           background: #3580ff;
           position: absolute;
           left: 0;
           right: 0;
           top: 0;
           z-index: 999;
           height: 1.555556rem;
       }
       
       .title {
           text-align: center;
           font-size: 0.462963rem;
           color: #fff;
           line-height: 1.555556rem;
       }
       
       .main {
           overflow-y: auto;
           overflow-x: hidden;
           -webkit-overflow-scrolling: touch;
           height: 100%;
       }
       
       .inner {
           padding: 1.555556rem 0;
       }`,
            'rem|px',
        ),
    );
});

function setCss(
    text: string,
    str: string,
    callback?: (
        n: number,
        dw: string,
        yss: string,
    ) => string,
): string {
    text = text.replace(/ /g, '  ');
    const reg = new RegExp(
        `\\s*(\\.|-|:|\\s|\\n|\\r|\\()([0-9\\.]+)(${str})(\\n|\\r|\\s|;|\\)|\\})`,
        'g',
    );
    text = text.replace(reg, function (a, b, c, d) {
        let th = c + d;
        if (b == '.') {
            th = b + th;
        }
        let thv = th;
        const s = Number(c);
        if (!isNaN(s)) {
            thv = '100px';
        }
        return a.replace(th, thv);
    });
    return text.replace(/  /g, ' ');
}
