import * as vscode from "vscode";

export const getIgnoredNames = (): Set<string> => {
  const config = vscode.workspace.getConfiguration("goodnamz");

  const globallyIgnoredName: string[] = config.get("ignoreGlobalNames") || [];

  const workspaceIgnoreNames: string[] = config.get("workspaceIgnoreNames") || [];

  return new Set([...globallyIgnoredName, ...workspaceIgnoreNames]);
};
