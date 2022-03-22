

import createCompiler from "./utils"
import { OptionsProps } from "../interface"
import { webpackConfigPath, reactScripts, } from "./../overrides/pathUtils"
import overridesDevServer from "./utils/overridesDevServer"

export default async (options: OptionsProps) => {
  delete require.cache[require.resolve(webpackConfigPath)];

  try {
    const { overrides, config } = await createCompiler("development", options, true)

    require.cache[require.resolve(webpackConfigPath)].exports = (env: string) => config;

    await overridesDevServer(overrides)

    require(`${reactScripts}/scripts/start`);

  }
  catch (error) {
    const message = error && error.message ? error.message : '';
    console.log('\x1b[31;1m KKT-SSR:START:ERROR: \x1b[0m\n', error);
    new Error(`KKT-SSR:START:ERROR: \n ${message}`);
    process.exit(1);
  }

}