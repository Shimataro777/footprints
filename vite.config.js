import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { copyFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

/* ============================================================
   **フォルダを使わず、すべてのファイルをいちばん上に置く作り。**
   GitHub でファイルを差し替えるとき、src や public の中まで
   入らずに済むようにしている。

   ふつう Vite は public フォルダの中身をそのまま公開先へ写すが、
   public をやめたので、アイコン（*.png）とマニフェスト（manifest*.json）は
   下の「写す係」が公開先（dist）のいちばん上へ写す。

   **index.html の中の ./icon-… や ./manifest-… を、Vite に触らせないこと。**
   Vite は index.html から指しているファイルを見つけると、名前に乱数を付けて
   assets フォルダへ移してしまう。マニフェストが assets の中に移ると、
   中に書いたアイコンの場所や起動の場所（start_url）がずれて、
   ホーム画面に置いたアプリが正しく動かなくなる。
   そこで「隠す係」が組み立ての前に目印へ置き換え、組み立ての後に元へ戻す。
   ============================================================ */

/* 公開先へそのまま写すファイル（いちばん上にあるものだけ） */
const isStatic = (name) => /\.png$/i.test(name) || /^manifest.*\.json$/i.test(name);

/* Vite は「#」で始まる場所を相手にしないので、それを目印に使う */
const MARK = "#__ft_static__/";

/* 隠す係（組み立ての前） */
const hideStatic = {
  name: "ft-hide-static",
  transformIndexHtml: {
    order: "pre",
    handler: (html) =>
      html.replace(/(href|src)="\.\/([^"/]+)"/g, (m, attr, file) =>
        isStatic(file) ? `${attr}="${MARK}${file}"` : m
      ),
  },
};

/* 戻す係（組み立ての後） */
const restoreStatic = {
  name: "ft-restore-static",
  transformIndexHtml: {
    order: "post",
    handler: (html) => html.split(MARK).join("./"),
  },
};

/* 写す係（組み立てが終わったら、アイコンとマニフェストを dist へ） */
function copyStatic() {
  let root, outDir;
  return {
    name: "ft-copy-static",
    apply: "build",
    configResolved(c) {
      root = c.root;
      outDir = resolve(c.root, c.build.outDir);
    },
    writeBundle() {
      for (const name of readdirSync(root)) {
        if (isStatic(name)) copyFileSync(resolve(root, name), resolve(outDir, name));
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), hideStatic, restoreStatic, copyStatic()],
  base: "./",
  /* public フォルダは使わない（上の「写す係」が代わりを務める） */
  publicDir: false,
});
