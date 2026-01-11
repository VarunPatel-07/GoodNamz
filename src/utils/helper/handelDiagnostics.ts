import * as vscode from "vscode";
import { BAD_NAME_REGEX } from "../constant/constant";
import { getIgnoredNames } from "./helper";
export const handelRefreshDiagnostics = (document: vscode.TextDocument, highlighter: vscode.DiagnosticCollection) => {
  const ignoredNames = getIgnoredNames();

  const text = document.getText();
  const diagnosticArr: vscode.Diagnostic[] = [];

  BAD_NAME_REGEX.lastIndex = 0;
  let match;

  while ((match = BAD_NAME_REGEX.exec(text)) !== null) {
    const fullMatch = match[0];
    const badVariable = match[2];
    console.log(fullMatch);

    if (ignoredNames.has(badVariable)) {
      continue;
    }

    const startPoint = match.index + fullMatch.indexOf(badVariable);
    const endPoint = startPoint + badVariable.length;

    const range = new vscode.Range(document.positionAt(startPoint), document.positionAt(endPoint));

    const highlight = new vscode.Diagnostic(
      range,
      `Bad variable name "${badVariable}"`,
      vscode.DiagnosticSeverity.Warning
    );

    highlight.source = "GoodNamz";
    highlight.code = {
      value: badVariable,
      target: vscode.Uri.parse("goodnamz://rename"),
    };
    diagnosticArr.push(highlight);
  }

  highlighter.set(document.uri, diagnosticArr);
};
