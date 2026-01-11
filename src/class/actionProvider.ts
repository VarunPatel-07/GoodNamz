import * as vscode from "vscode";
import { GetNameSuggestion } from "../utils/helper/getSuggestions";
export class GoodNameActionProvider implements vscode.CodeActionProvider {
  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range | vscode.Selection,
    context: vscode.CodeActionContext,
    token: vscode.CancellationToken
  ): vscode.CodeAction[] {
    const action: vscode.CodeAction[] = [];
    const lineContext = document.lineAt(range.start.line);

    for (const diagnostic of context.diagnostics) {
      if (diagnostic.source !== "GoodNamz") {
        continue;
      }
      const code = diagnostic.code;

      if (typeof code !== "object" || code === null || !("value" in code)) {
        continue;
      }
      const badName = String(code.value);
      const fixedGoodName = GetNameSuggestion(badName);

      const renameAction = new vscode.CodeAction(
        `Rename "${badName}" → "${fixedGoodName}"`,
        vscode.CodeActionKind.QuickFix
      );
      renameAction.edit = new vscode.WorkspaceEdit();
      renameAction.edit.replace(document.uri, diagnostic.range, fixedGoodName);
      renameAction.diagnostics = [diagnostic];
      renameAction.isPreferred = true;

      const ignoreGlobalAction = new vscode.CodeAction(`Ignore "${badName}" globally`, vscode.CodeActionKind.QuickFix);

      ignoreGlobalAction.command = {
        title: "Ignore Bad Name",
        command: "goodnamz.ignoreGlobal",
        arguments: [badName, false],
      };

      const ignoredWorkspaceAction = new vscode.CodeAction(
        `Ignore "${badName}" in workspace`,
        vscode.CodeActionKind.QuickFix
      );
      ignoredWorkspaceAction.command = {
        title: "Ignore Bad Name",
        command: "goodnamz.ignoreWorkspace",
        arguments: [badName, false],
      };

      action.push(renameAction, ignoreGlobalAction, ignoredWorkspaceAction);
    }
    return action;
  }
}
