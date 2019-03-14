import { importYogaConfig } from '../../../config'
import { existsSync, writeFileSync } from 'fs'
import chalk from 'chalk'
import { writeEjectFiles } from '../build'
import { relative } from 'path'
import { resolvePrettierOptions, prettify } from '../../../helpers'

export default async () => {
  const info = importYogaConfig()
  const prettierOptions = await resolvePrettierOptions(info.projectDir)

  if (
    info.yogaConfig.ejectFilePath &&
    existsSync(info.yogaConfig.ejectFilePath)
  ) {
    console.log(
      `${chalk.yellow(
        'You are already ejected',
      )}. If you want to run the command, please delete ${chalk.yellow(
        relative(info.projectDir, info.yogaConfig.ejectFilePath),
      )}`,
    )
    process.exit(1)
  }

  writeEjectFiles(info, (filePath, content) => writeFileSync(filePath, prettify(content, prettierOptions)))
}
