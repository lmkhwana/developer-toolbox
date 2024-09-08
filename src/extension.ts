import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  // Register the command to open the Live API Tester webview
  context.subscriptions.push(
    vscode.commands.registerCommand('developer-toolbox.showApiTester', () => {
      const panel = vscode.window.createWebviewPanel(
        'apiTester',
        'Live API Tester',
        vscode.ViewColumn.One,
        { enableScripts: true }
      );

      panel.webview.html = getApiTesterHtml();
    })
  );

  // Register the tree data provider for the Developer Toolbox
  const treeDataProvider = new MyTreeDataProvider();
  vscode.window.registerTreeDataProvider('toolboxView', treeDataProvider);
}

// HTML for the API Tester Webview
function getApiTesterHtml() {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Live API Tester</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 10px; }
        label { margin-bottom: 5px; display: block; }
        input, select, textarea { width: 100%; margin-bottom: 10px; padding: 8px; font-size: 14px; }
        button { padding: 10px 15px; background-color: #007ACC; color: white; border: none; cursor: pointer; }
        button:hover { background-color: #005B9E; }
        pre { background-color: #f5f5f5; padding: 10px; }
      </style>
    </head>
    <body>
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
      
      <h3>Response:</h3>
      <pre id="response"></pre>

      <script>
        const vscode = acquireVsCodeApi();

        document.getElementById('apiForm').addEventListener('submit', async (e) => {
          e.preventDefault();

          const url = document.getElementById('url').value;
          const method = document.getElementById('method').value;
          const headers = document.getElementById('headers').value;
          const body = document.getElementById('body').value;

          const options = {
            method,
            headers: headers ? JSON.parse(headers) : {},
            body: body && (method === 'POST' || method === 'PUT') ? body : null
          };

          try {
            const response = await fetch(url, options);
            const text = await response.text();
            document.getElementById('response').textContent = text;
          } catch (error) {
            document.getElementById('response').textContent = 'Error: ' + error.message;
          }
        });
      </script>
    </body>
    </html>`;
}

// Tree View Data Provider
class MyTreeDataProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: vscode.TreeItem): vscode.ProviderResult<vscode.TreeItem[]> {
    return [new vscode.TreeItem("Tool 1"), new vscode.TreeItem("Tool 2")];
  }
}

export function deactivate() {}
