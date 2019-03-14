import { writeFileSync, readFileSync } from 'fs'
import { printType, GraphQLSchema } from 'graphql'
import * as ts from 'typescript'

const FUNCTION_NAMES = [
  'objectType',
  'enumType',
  'inputObjectType',
  'interfaceType',
  'unionType',
  'prismaObjectType',
  'prismaInputObjectType',
  'prismaEnumType',
]

function isNexusCall(declaration: ts.VariableDeclaration) {
  return (
    declaration.initializer &&
    ts.isCallExpression(declaration.initializer) &&
    ts.isIdentifier(declaration.initializer.expression) &&
    FUNCTION_NAMES.includes(
      declaration.initializer.expression.escapedText.toString(),
    ) &&
    declaration.initializer.arguments.length === 1 &&
    ts.isObjectLiteralExpression(declaration.initializer.arguments[0])
  )
}

function getAllLeadingComments(
  node: ts.Node,
): ReadonlyArray<ts.CommentRange & { text: string }> {
  const allRanges: Array<Readonly<ts.CommentRange & { text: string }>> = []
  const nodeText = node.getFullText()
  const cr = ts.getLeadingCommentRanges(nodeText, 0)
  if (cr) {
    allRanges.push(
      ...cr.map(c => ({ ...c, text: nodeText.substring(c.pos, c.end) })),
    )
  }
  const synthetic = ts.getSyntheticLeadingComments(node)
  if (synthetic) allRanges.push(...synthetic)
  return allRanges
}

function extractTypeName(declaration: ts.VariableDeclaration) {
  const initializer = declaration.initializer as ts.CallExpression
  const argument = initializer.arguments[0] as ts.ObjectLiteralExpression
  const nameProperty = argument.properties
    .filter(ts.isPropertyAssignment)
    .find(
      p => ts.isIdentifier(p.name) && p.name.escapedText.toString() === 'name',
    )

  if (!nameProperty) {
    throw new Error('Could not find `name` property')
  }

  if (!ts.isStringLiteral(nameProperty.initializer)) {
    throw new Error('We only support string literal for name properties')
  }

  return nameProperty.initializer.text
}

function createMultiLineComment(text: string) {
  const comment: ts.SynthesizedComment = {
    kind: ts.SyntaxKind.MultiLineCommentTrivia,
    text: ' ' + text,
    hasTrailingNewLine: true,
    pos: -1,
    end: -1,
  }

  return comment
}

function setMultilineComments(node: ts.Node, comments: any[]) {
  ts.setSyntheticLeadingComments(node, comments)
}

export function addSDLComments(path: string, schema: GraphQLSchema) {
  const source = readFileSync(path).toString()
  const sourceFile = ts.createSourceFile(
    path,
    source,
    ts.ScriptTarget.Latest,
    true,
  )

  const variablesStatements = sourceFile.statements
    .filter(ts.isVariableStatement)
    .filter(v => v.declarationList.declarations.length === 1)

  variablesStatements.forEach(variableStatement => {
    const declaration = variableStatement.declarationList.declarations[0]

    if (isNexusCall(declaration)) {
      const typeName = extractTypeName(declaration)
      const graphqlType = schema.getType(typeName)

      if (!graphqlType) {
        return
      }

      const comments = getAllLeadingComments(variableStatement)
      const sdlComment = createMultiLineComment(printType(graphqlType))

      if (!comments) {
        setMultilineComments(variableStatement, [sdlComment])
      } else {
        const existingSdlComment = comments.find(c =>
          c.text.includes(`type ${typeName}`),
        )

        if (!existingSdlComment) {
          setMultilineComments(variableStatement, [sdlComment])
        } else {
          const replacedComments = comments.filter(
            c => !c.text.includes(`type ${typeName}`),
          )

          replacedComments.push(sdlComment)

          setMultilineComments(variableStatement, replacedComments)
        }
      }
    }
  })

  const printer = ts.createPrinter({ removeComments: false })
  const sourceWithComments = printer.printFile(sourceFile)

  writeFileSync(path, sourceWithComments)
}
