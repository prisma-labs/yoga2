import { importYogaConfig } from '../../../config'
import { existsSync, writeFileSync } from 'fs'
import chalk from 'chalk'
import { writeEjectFiles } from '../build'
import { relative } from 'path'
import { resolvePrettierOptions, prettify } from '../../../helpers'

export default async (argv: Record<string, string>) => {
  const config = importYogaConfig({ env: argv.env })
  const prettierOptions = await resolvePrettierOptions(config.projectDir)

  if (
    config.yogaConfig.ejectedFilePath && existsSync(config.yogaConfig.ejectedFilePath)
  ) {
    console.log(
      `${chalk.yellow(
        'You are already ejected',
      )}. If you want to run the command, please delete ${chalk.yellow(
        relative(config.projectDir, config.yogaConfig.ejectedFilePath),
      )}`,
    )
    process.exit(1)
  }

  writeEjectFiles(config, (filePath, content) =>
    writeFileSync(filePath, prettify(content, prettierOptions)),
  )
}
