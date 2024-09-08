import * as path from 'path';
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as yaml from 'js-yaml'; // Add this for YAML support
import * as xml2js from 'xml2js'; // Add this for XML support


// Function to get the HTML content with embedded CSS and JS
function getApiTesterHtml(extensionPath: string): string {
  return fs.readFileSync(path.join(extensionPath, 'src/webviews', 'api-tester.html'), 'utf8');
}

function getJsonYamlFormatterHtml(extensionPath: string): string {
  return fs.readFileSync(path.join(extensionPath, 'src/webviews', 'json-yaml-formatter.html'), 'utf8');
}

async function formatInput(panel: vscode.WebviewPanel, inputText: string, inputFormat: string) {
  try {
    let formattedText;
    if (inputFormat === 'json') {
      formattedText = JSON.stringify(JSON.parse(inputText), null, 2);
    } else if (inputFormat === 'yaml') {
      formattedText = yaml.dump(yaml.load(inputText), { indent: 2 });
    }
    panel.webview.postMessage({ command: 'updateOutput', outputText: formattedText });
  } catch (error) {
    panel.webview.postMessage({ command: 'updateOutput', outputText: 'Formatting error: '});
  }
}

async function validateInput(panel: vscode.WebviewPanel, inputText: string, inputFormat: string) {
  try {
    if (inputFormat === 'json') {
      JSON.parse(inputText);
      panel.webview.postMessage({ command: 'updateOutput', outputText: 'Valid JSON' });
    } else if (inputFormat === 'yaml') {
      yaml.load(inputText);
      panel.webview.postMessage({ command: 'updateOutput', outputText: 'Valid YAML' });
    }
  } catch (error) {
    panel.webview.postMessage({ command: 'updateOutput', outputText: 'Validation error: '});
  }
}

async function convertJsonToXml(panel: vscode.WebviewPanel, inputText: string) {
  try {
    const json = JSON.parse(inputText);
    const builder = new xml2js.Builder();
    const xml = builder.buildObject(json);
    panel.webview.postMessage({ command: 'updateOutput', outputText: xml });
  } catch (error) {
    panel.webview.postMessage({ command: 'updateOutput', outputText: 'Conversion error: '});
  }
}

async function convertXmlToJson(panel: vscode.WebviewPanel, inputText: string) {
  try {
    const parser = new xml2js.Parser();
    parser.parseString(inputText, (err, result) => {
      if (err) {
        panel.webview.postMessage({ command: 'updateOutput', outputText: 'Conversion error: ' + err.message });
      } else {
        panel.webview.postMessage({ command: 'updateOutput', outputText: JSON.stringify(result, null, 2) });
      }
    });
  } catch (error) {
    panel.webview.postMessage({ command: 'updateOutput', outputText: 'Conversion error: '});
  }
}


export function activate(context: vscode.ExtensionContext) {
  // Register the command to open the JSON/YAML Formatter
  let disposable = vscode.commands.registerCommand('developer-toolbox.showJsonYamlFormatter', () => {
    const panel = vscode.window.createWebviewPanel(
      'jsonYamlFormatter',
      'JSON/YAML Formatter and Validator',
      vscode.ViewColumn.One,
      { 
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(context.extensionPath, 'src/media')),
          vscode.Uri.file(path.join(context.extensionPath, 'src/webviews'))
        ]
      }
    );

    panel.webview.html = getJsonYamlFormatterHtml(context.extensionPath);

    panel.webview.onDidReceiveMessage(
      async message => {
        const { command, inputText, inputFormat } = message;

        switch (command) {
          case 'format':
            await formatInput(panel, inputText, inputFormat);
            break;
          case 'validate':
            await validateInput(panel, inputText, inputFormat);
            break;
          case 'jsonToXml':
            await convertJsonToXml(panel, inputText);
            break;
          case 'xmlToJson':
            await convertXmlToJson(panel, inputText);
            break;
        }
      },
      undefined,
      context.subscriptions
    );
  });


  // Register the command to open the API Tester webview
  let apiTesterCommand = vscode.commands.registerCommand('developer-toolbox.showApiTester', () => {
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
  });

  // Register the tree data provider for the Developer Toolbox
  const treeDataProvider = new MyTreeDataProvider();
  vscode.window.registerTreeDataProvider('toolboxView', treeDataProvider);

  context.subscriptions.push(disposable, apiTesterCommand);
}

class MyTreeDataProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | undefined> = new vscode.EventEmitter<vscode.TreeItem | undefined>();
  readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | undefined> = this._onDidChangeTreeData.event;

  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: vscode.TreeItem): vscode.ProviderResult<vscode.TreeItem[]> {
    if (element === undefined) {
      const apiTesterItem = new vscode.TreeItem("Live API Tester", vscode.TreeItemCollapsibleState.None);
      apiTesterItem.command = {
        command: 'developer-toolbox.showApiTester',
        title: 'Open API Tester'
      };

      const jsonYamlFormatterItem = new vscode.TreeItem("JSON/XML Formatter", vscode.TreeItemCollapsibleState.None);
      jsonYamlFormatterItem.command = {
        command: 'developer-toolbox.showJsonYamlFormatter',
        title: 'Open JSON/YAML Formatter'
      };

      return [apiTesterItem, jsonYamlFormatterItem];
    }
    return [];
  }
}

export function deactivate() { }