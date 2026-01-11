import * as vscode from "vscode";
import { GoodNameActionProvider } from "./class/actionProvider";
import { handelRefreshDiagnostics } from "./utils/helper/handelDiagnostics";

export function activate(context: vscode.ExtensionContext) {
  console.log("GoodNamz Are Active Now");
  const handelIgnoreGlobalCommand = vscode.commands.registerCommand(
    "goodnamz.ignoreGlobal",
    async (badName: string) => {
      const config = vscode.workspace.getConfiguration("goodnamz");

      const ignoredNames: string[] = config.get("ignoreGlobalNames") || [];

      if (!ignoredNames?.includes(badName)) {
        await config.update("ignoreGlobalNames", [...ignoredNames, badName], vscode.ConfigurationTarget.Global);
      }
    }
  );

  const handelIgnoreWorkspaceCommand = vscode.commands.registerCommand(
    "goodnamz.ignoreWorkspace",
    async (badName: string) => {
      const config = vscode.workspace.getConfiguration("goodnamz");

      const ignoredNames: string[] = config.get("workspaceIgnoreNames") || [];
      if (!ignoredNames.includes(badName)) {
        await config.update("workspaceIgnoreNames", [...ignoredNames, badName], vscode.ConfigurationTarget.Workspace);
      }
    }
  );
  context.subscriptions.push(handelIgnoreGlobalCommand, handelIgnoreWorkspaceCommand);

  const highlighterCollection = vscode.languages.createDiagnosticCollection("goodnamz");

  context.subscriptions.push(highlighterCollection);

  const disposable = vscode.workspace.onDidChangeTextDocument((event) =>
    handelRefreshDiagnostics(event.document, highlighterCollection)
  );

  const handelConfigChange = vscode.workspace.onDidChangeConfiguration((event) => {
    if (
      event.affectsConfiguration("goodnamz.ignoreGlobalNames") ||
      event.affectsConfiguration("goodnamz.workspaceIgnoreNames")
    ) {
      for (const document of vscode.window.visibleTextEditors) {
        handelRefreshDiagnostics(document.document, highlighterCollection);
      }
    }
  });

  for (const editor of vscode.window.visibleTextEditors) {
    handelRefreshDiagnostics(editor.document, highlighterCollection);
  }

  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(["javascript", "typescript"], new GoodNameActionProvider(), {
      providedCodeActionKinds: [vscode.CodeActionKind.QuickFix],
    })
  );

  context.subscriptions.push(disposable, handelConfigChange);
}

export function deactivate() {}
