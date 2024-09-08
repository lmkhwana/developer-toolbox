# Developer Toolbox

A VS Code extension providing a suite of developer tools.

## Micro Tools Included

- **Live API Tester**: A webview panel that allows you to send HTTP requests and view responses directly within VS Code.
- **JSON/XML Formatter and Validator**: Quickly format, validate, and convert JSON or XML files with a user-friendly interface.

## Installation

1. **Clone the Repository**:
    ```sh
    git clone https://github.com/lmkhwana/developer-toolbox.git
    ```
2. **Navigate to the Extension Directory**:
    ```sh
    cd developer-toolbox
    ```
3. **Install Dependencies**:
    ```sh
    npm install
    ```
4. **Compile the Extension**:
    ```sh
    npm run compile
    ```

## Usage

### Microtool - API Tester

1. **Open the Command Palette** (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS).
2. **Search for `Developer Toolbox: Show API Tester`** and select it.

   This will open a new webview panel where you can:

   - Enter the API URL.
   - Select the HTTP method (GET, POST, PUT, DELETE).
   - Provide request headers and body if needed.
   - Send the request and view the response.

### Microtool - JSON/YAML Formatter and Validator

1. **Open the Command Palette** (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS).
2. **Search for `Developer Toolbox: Show JSON/XML Formatter`** and select it.

   This will open the JSON/YAML Formatter and Validator tool where you can:

   - Choose between JSON and XML formats.
   - Enter your JSON or XML data in the input box.
   - Format the data, validate it, or convert between JSON and XML formats.
   - View the results in a resizable output box, which will only display content when there is output.
  ![image](https://github.com/user-attachments/assets/0ec01f75-68e3-41ed-896b-f8e6ee4fd1f8)


## Development

### Running the Extension

1. **Launch Extension**:
    Press `F5` to start a new VS Code window with your extension loaded.

2. **Debugging**:
    Set breakpoints in your code and use the debugging tools in VS Code to troubleshoot your extension.
   
## Contributing

1. **Fork the Repository** and create a new branch for your feature or bug fix.
2. **Make Your Changes** and ensure that all tests pass.
3. **Submit a Pull Request** with a clear description of your changes.

## Contact

For any issues or inquiries, please open an issue on the [GitHub repository](https://github.com/lmkhwana/developer-toolbox/issues).

---

Feel free to adjust any sections or add additional details as needed.
