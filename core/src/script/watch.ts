

import createCompiler from "./utils"
import clearConsole from 'react-dev-utils/clearConsole';
import { OptionsProps } from "../interface"

const today = () => new Date().toISOString().split('.')[0].replace('T', ' ');

export default async (options: OptionsProps) => {
  const { compiler, overrides } = await createCompiler("development", options)
  compiler.watch({
    ...(overrides.watchOptions || {}),
  }, (err, stats) => {
    if (err) {
      console.log('❌ KKT-SSR:\x1b[31;1mERR\x1b[0m:', err);
      return;
    }
    if (stats.hasErrors()) {
      clearConsole();
      console.log(`❌ KKT-SSR:\x1b[31;1mERR\x1b[0m: \x1b[35;1m${today()}\x1b[0m\n`, stats.toString());
      return;
    }
    clearConsole();
    console.log(`🚀 started! \x1b[35;1m${today()}\x1b[0m`);
  });

}