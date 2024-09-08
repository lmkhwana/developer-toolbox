import * as path from 'path';
import * as vscode from 'vscode';
import * as fs from 'fs';

// Function to get the HTML content with embedded CSS and JS
function getApiTesterHtml(extensionPath: string): string {
  // Embed CSS and JS directly into HTML
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Live API Tester</title>
      <style>
        ${fs.readFileSync(path.join(extensionPath, 'src/media', 'api-tester.css'), 'utf8')}
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Live API Tester</h2>
        <form id="apiForm">
          <label for="url">API URL</label>
          <input type="text" id="url" placeholder="https://api.example.com/endpoint" required />

          <label for="method">HTTP Method</label>
          <select id="method">
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>

          <label for="headers">Headers (JSON)</label>
          <textarea id="headers" placeholder='{"Content-Type": "application/json"}'></textarea>

          <label for="body">Body (JSON for POST/PUT)</label>
          <textarea id="body" placeholder='{"key": "value"}'></textarea>

          <button type="submit">Send Request</button>
        </form>

        <div class="loader" id="loader"></div>
        <div class="response-container" id="responseContainer">
          <h3>Response:</h3>
          <pre id="response"></pre>
        </div>
      </div>
      <script>
        ${fs.readFileSync(path.join(extensionPath, 'src/media', 'api-tester.js'), 'utf8')}
      </script>
    </body>
    </html>
  `;
}

export function activate(context: vscode.ExtensionContext) {
  // Register the command to open the Live API Tester webview
  context.subscriptions.push(
    vscode.commands.registerCommand('developer-toolbox.showApiTester', () => {
      const panel = vscode.window.createWebviewPanel(
        'apiTester',
        'Live API Tester',
        vscode.ViewColumn.One,
        { 
          enableScripts: true,
          localResourceRoots: [
            vscode.Uri.file(path.join(context.extensionPath, 'src/media')),
            vscode.Uri.file(path.join(context.extensionPath, 'src/webviews'))
          ]
        }
      );

      panel.webview.html = getApiTesterHtml(context.extensionPath);
    })
  );

  // Register the tree data provider for the Developer Toolbox
  const treeDataProvider = new MyTreeDataProvider();
  vscode.window.registerTreeDataProvider('toolboxView', treeDataProvider);
}

class MyTreeDataProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | undefined> = new vscode.EventEmitter<vscode.TreeItem | undefined>();
  readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | undefined> = this._onDidChangeTreeData.event;

  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: vscode.TreeItem): vscode.ProviderResult<vscode.TreeItem[]> {
    if (element === undefined) {
      const apiTesterItem = new vscode.TreeItem("API Tester", vscode.TreeItemCollapsibleState.None);
      apiTesterItem.command = {
        command: 'developer-toolbox.showApiTester',
        title: 'Open API Tester'
      };

      return [apiTesterItem];
    }
    return [];
  }
}

export function deactivate() { }