// Language configurations for React Ace
export const languageConfigs = {
  javascript: {
    id: 63,
    name: "JavaScript (Node 12.14.0)",
    mode: "javascript",
    defaultCode: `// JavaScript Example
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet("World");`,
  },
  typescript: {
    id: 74,
    name: "TypeScript (3.7.4)",
    mode: "typescript",
    defaultCode: `// TypeScript Example
function greet(name: string): void {
  console.log(\`Hello, \${name}!\`);
}

greet("World");`,
  },
  cpp: {
    id: 54,
    name: "C++ (GCC 9.2.0)",
    mode: "c_cpp",
    defaultCode: `// C++ Example
#include <iostream>
#include <string>

int main() {
    std::string name = "World";
    std::cout << "Hello, " << name << "!" << std::endl;
    return 0;
}`,
  },
  c: {
    id: 50,
    name: "C (GCC 9.2.0)",
    mode: "c_cpp",
    defaultCode: `// C Example
#include <stdio.h>

int main() {
    char name[] = "World";
    printf("Hello, %s!\\n", name);
    return 0;
}`,
  },
  java: {
    id: 62,
    name: "Java (OpenJDK 13.0.1)",
    mode: "java",
    defaultCode: `// Java Example
public class Main {
    public static void main(String[] args) {
        String name = "World";
        System.out.println("Hello, " + name + "!");
    }
}`,
  },
  python: {
    id: 71,
    name: "Python (3.8.1)",
    mode: "python",
    defaultCode: `# Python Example
def greet(name):
    print(f"Hello, {name}!")

if __name__ == "__main__":
    greet("World")`,
  },
  sql: {
    id: 82,
    name: "SQL (SQLite 3.27.2)",
    mode: "sql",
    defaultCode: `-- SQL Example
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (id, name, email) VALUES 
(1, 'John Doe', 'john@example.com'),
(2, 'Jane Smith', 'jane@example.com');

SELECT * FROM users WHERE name LIKE '%John%';`,
  },
};

// Theme definition for React Ace

import ace from "ace-builds";

const customTheme = {
  name: "ZERO_ONE",
  isDark: true,
  cssClass: "ace-zero-one-theme",
  cssText: `
    @import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&display=swap');
    
    .ace-zero-one-theme {
        font-family: 'Source Code Pro', monospace !important;
        /* Using website's CSS variables */
        --bg-primary: hsl(0, 0%, 0%);           /* --background */
        --bg-secondary: hsl(0, 0%, 6%);         /* --background1 */
        --text-primary: hsl(0, 0%, 98%);        /* --foreground */
        --text-muted: hsl(240, 5%, 64.9%);     /* --muted-foreground */
        --accent-color: hsl(0, 100%, 60%);     /* --accent */
        --accent-light: hsl(345, 100%, 60%);   /* --accent-light */
        --border-color: hsl(240, 3.7%, 15.9%); /* --border */
        --secondary: hsl(240, 3.7%, 15.9%);    /* --secondary */
        
        /* Git terminal inspired color palette */
        --terminal-green: #00ff7f;             /* Bright green like git success */
        --terminal-purple: #bd93f9;            /* Purple like git branch */
        --terminal-yellow: #f1fa8c;            /* Yellow like git warnings */
        --terminal-cyan: #8be9fd;              /* Cyan like git info */
        --terminal-orange: #ffb86c;            /* Orange like git modified */
        --terminal-pink: var(--accent-light);              /* Pink like git staged */
        
        /* Syntax highlighting colors with terminal vibes */
        --keyword-color: var(--terminal-purple);   /* Purple for keywords */
        --string-color: var(--terminal-yellow);    /* Yellow for strings */
        --comment-color: hsl(240, 5%, 64.9%);      /* Keep muted for comments */
        --function-color: var(--terminal-cyan);    /* Cyan for functions */
        --constant-color: var(--terminal-pink);    /* Pink for constants */
        --number-color: var(--terminal-green);     /* Green for numbers */
        --variable-color: var(--terminal-orange);  /* Orange for variables */
    }
    
    /* Main editor background */
    .ace-zero-one-theme {
        background-color: var(--bg-secondary);
        color: var(--text-primary);
        border-radius: 0.5rem;
        line-height: 1.5;
        font-size: 16px;
    }
    
    /* Gutter (line numbers area) */
    .ace-zero-one-theme .ace_gutter {
        background: var(--bg-primary);
        color: var(--text-muted);
        border-right: 1px solid var(--border-color);
    }
    
    .ace-zero-one-theme .ace_gutter-active-line {
        background: var(--bg-secondary);
    }
    
    /* Active line highlight */
    .ace-zero-one-theme .ace_marker-layer .ace_active-line {
        background: rgba(255, 255, 255, 0.03);
    }
    
    /* Cursor */
    .ace-zero-one-theme .ace_cursor {
        color: var(--accent-color);
        border-left: 2px solid var(--accent-color);
    }
    
    /* Selection */
    .ace-zero-one-theme .ace_marker-layer .ace_selection {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
    }
    
    /* Selected word highlight */
    .ace-zero-one-theme .ace_marker-layer .ace_selected-word {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--border-color);
        border-radius: 2px;
    }
    
    /* Keywords (if, else, function, class, etc.) */
    .ace-zero-one-theme .ace_keyword {
        color: var(--keyword-color);
        font-weight: 600;
    }
    
    /* Strings */
    .ace-zero-one-theme .ace_string,
    .ace-zero-one-theme .ace_string.ace_quasi {
        color: var(--string-color);
    }
    
    /* Comments */
    .ace-zero-one-theme .ace_comment {
        color: var(--comment-color);
        font-style: italic;
    }
    
    /* Functions and methods */
    .ace-zero-one-theme .ace_support.ace_function,
    .ace-zero-one-theme .ace_entity.ace_name.ace_function {
        color: var(--function-color);
        font-weight: 500;
    }
    
    /* Constants and built-ins */
    .ace-zero-one-theme .ace_support.ace_constant,
    .ace-zero-one-theme .ace_constant.ace_language {
        color: var(--constant-color);
    }
    
    /* Numbers */
    .ace-zero-one-theme .ace_constant.ace_numeric {
        color: var(--number-color);
    }
    
    /* Variables and identifiers */
    .ace-zero-one-theme .ace_variable {
        color: var(--variable-color);
    }
    
    .ace-zero-one-theme .ace_identifier {
        color: var(--text-primary);
    }
    
    /* Operators and punctuation */
    .ace-zero-one-theme .ace_punctuation {
        color: var(--terminal-cyan);
    }
    
    .ace-zero-one-theme .ace_operator {
        color: var(--terminal-pink);
        font-weight: 500;
    }
    .ace-zero-one-theme .ace_constant .ace_other{
      color: var(--terminal-orange);
    }

    /* Search box styling */
    .ace-zero-one-theme .ace_search {
      color: var(--text-primary);
      background-color: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 0.5rem;
      backdrop-filter: blur(10px);
      padding: 8px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
    }

    .ace-zero-one-theme .ace_tooltip.ace_dark{
      background-color: var(--bg-secondary);
      border: 1px solid var(--border-color);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
      color: var(--text-primary);
    }
    
    .ace-zero-one-theme .ace_search .ace_searchbtn_close{
      background-color: var(--bg-primary);
      color: var(--text-muted);
    }
    .ace-zero-one-theme .ace_search .ace_searchbtn_close:hover {
        background-color: var(--accent-color);
        color: var(--text-primary);
    }
    
    .ace-zero-one-theme .ace_search .ace_search_field {
      border: 1px solid var(--border-color);
      background-color: var(--bg-primary);
      color: var(--text-primary);
      border-radius: 4px;
      padding: 4px 8px;
      font-family: 'Source Code Pro', monospace;
      margin-right: 8px;
    }
    
    .ace-zero-one-theme .ace_search .ace_search_field:focus {
      outline: none;
      box-shadow: 0 0 0 2px rgba(255, 0, 0, 0.2);
      border-color: var(--terminal-orange);
    }
    
    /* Toggle buttons (for search options like regex, case sensitive) */
    .ace-zero-one-theme .ace_button {
      background-color: var(--bg-primary);
      color: var(--text-muted);
      border: 1px solid var(--border-color);
      border-radius: 4px;
      padding: 4px 8px;
      font-size: 12px;
      transition: all 0.2s ease;
    }
    
    .ace-zero-one-theme .ace_button:hover {
      background-color: var(--secondary);
      color: var(--text-primary);      
      border-color: var(--terminal-orange);

    }
    
    .ace-zero-one-theme .ace_button.checked {
      background-color: var(--accent-color);
      color: var(--bg-primary);
      border-color: var(--accent-color);
      font-weight: 600;
    }
    
    /* Search action buttons (Find, Replace, etc.) */
    .ace-zero-one-theme .ace_searchbtn {
      background-color: var(--terminal-purple);
      color: var(--bg-primary);
      border: 1px solid var(--terminal-purple);
      padding: 4px 12px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      }

      .ace-zero-one-theme .ace_searchbtn:first-child {
        border-radius: 3px 0 0 3px!important;
      }
      .ace-zero-one-theme .ace_searchbtn.next, 
      .ace-zero-one-theme .ace_searchbtn.prev{
        padding: 4px 12px;
      } 
      .ace-zero-one-theme .ace_searchbtn.next::after , 
      .ace-zero-one-theme .ace_searchbtn.prev::after {
        border-color: var(--bg-primary);
      } 
    
    .ace-zero-one-theme .ace_searchbtn:hover {
      background-color: var(--terminal-cyan);
      border-color: var(--terminal-cyan);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
    
    .ace-zero-one-theme .ace_searchbtn:active {
      transform: translateY(0);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }
    
    /* Replace field styling */
    .ace-zero-one-theme .ace_search .ace_replace_form .ace_search_field {
      background-color: var(--bg-primary);
    }
    
    .ace-zero-one-theme .ace_search .ace_replace_form .ace_search_field:focus {
      border-color: var(--terminal-orange);
      box-shadow: 0 0 0 2px rgba(255, 184, 108, 0.2);
    }
    
    /* HTML/XML tags */
    .ace-zero-one-theme .ace_entity.ace_name.ace_tag,
    .ace-zero-one-theme .ace_meta.ace_tag {
        color: var(--keyword-color);
    }
    
    /* HTML/XML attributes */
    .ace-zero-one-theme .ace_entity.ace_other.ace_attribute-name {
        color: var(--function-color);
    }
    
    /* Storage types (var, let, const, etc.) */
    .ace-zero-one-theme .ace_storage {
        color: var(--keyword-color);
        font-weight: 600;
    }
    
    /* Classes and types */
    .ace-zero-one-theme .ace_entity.ace_name.ace_class,
    .ace-zero-one-theme .ace_entity.ace_name.ace_type {
        color: var(--constant-color);
        font-weight: 500;
    }
    
    /* Additional terminal-inspired elements */
    .ace-zero-one-theme .ace_support.ace_type {
        color: var(--terminal-purple);
    }
    
    .ace-zero-one-theme .ace_support.ace_class {
        color: var(--terminal-cyan);
        font-weight: 500;
    }
    
    /* Boolean values */
    .ace-zero-one-theme .ace_constant.ace_boolean {
        color: var(--terminal-orange);
        font-weight: 600;
    }
    
    /* Null, undefined */
    .ace-zero-one-theme .ace_constant.ace_null,
    .ace-zero-one-theme .ace_constant.ace_undefined {
        color: var(--terminal-pink);
        font-style: italic;
    }
    
    /* Regular expressions */
    .ace-zero-one-theme .ace_string.ace_regexp {
        color: var(--terminal-green);
        background: rgba(0, 255, 127, 0.1);
    }
    
    /* Template literals */
    .ace-zero-one-theme .ace_string.ace_template {
        color: var(--terminal-yellow);
    }
    
    /* Escape sequences in strings */
    .ace-zero-one-theme .ace_constant.ace_character.ace_escape {
        color: var(--terminal-orange);
        font-weight: bold;
    }
    
    /* Invalid/Error highlighting */
    .ace-zero-one-theme .ace_invalid {
        background-color: rgba(255, 0, 0, 0.2);
        color: var(--text-primary);
        border-bottom: 2px solid red;
    }
    
    /* Invisible characters */
    .ace-zero-one-theme .ace_invisible {
        color: var(--text-muted);
    }
    
    /* Print margin */
    .ace-zero-one-theme .ace_print-margin {
        width: 1px;
        background: var(--border-color);
    }
    
    /* Bracket matching */
    .ace-zero-one-theme .ace_bracket {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid var(--accent-color);
        border-radius: 2px;
    }
    
    /* Fold indicators */
    .ace-zero-one-theme .ace_fold {
        background-color: var(--accent-color);
        color: var(--bg-primary);
        border-radius: 2px;
    }
    
    /* Scrollbar styling to match website */
    .ace-zero-one-theme .ace_scrollbar::-webkit-scrollbar {
        width: 5px;
    }
    
    .ace-zero-one-theme .ace_scrollbar::-webkit-scrollbar-track {
        background-color: transparent;
        border-radius: 10px;
    }
    
    .ace-zero-one-theme .ace_scrollbar::-webkit-scrollbar-thumb {
        background: #6d6d6d;
        border-radius: 10px;
    }
    
    /* Error markers for syntax errors */
    .ace-zero-one-theme .error-marker {
        background: rgba(255, 0, 0, 0.1);
        border-left: 3px solid var(--accent-color);
        position: absolute;
        z-index: 20;
    }
    
    /* Success/Info markers (like git status) */
    .ace-zero-one-theme .success-marker {
        background: rgba(0, 255, 127, 0.1);
        border-left: 3px solid var(--terminal-green);
        position: absolute;
        z-index: 20;
    }
    
    .ace-zero-one-theme .warning-marker {
        background: rgba(241, 250, 140, 0.1);
        border-left: 3px solid var(--terminal-yellow);
        position: absolute;
        z-index: 20;
    }
    
    /* Enhanced bracket matching with terminal colors */
    .ace-zero-one-theme .ace_bracket {
        background: rgba(189, 147, 249, 0.2);
        border: 1px solid var(--terminal-purple);
        border-radius: 2px;
    }
    
    /* Git-like diff styling */
    .ace-zero-one-theme .ace_diff-added {
        background: rgba(0, 255, 127, 0.1);
        color: var(--terminal-green);
    }
    
    .ace-zero-one-theme .ace_diff-removed {
        background: rgba(255, 0, 0, 0.1);
        color: var(--accent-color);
    }
    
    /* Terminal-style line highlight */
    .ace-zero-one-theme .ace_marker-layer .ace_active-line {
        background: linear-gradient(90deg, 
            rgba(189, 147, 249, 0.05) 0%, 
            rgba(255, 255, 255, 0.02) 50%, 
            rgba(0, 255, 127, 0.05) 100%);
    }
  `,
};

ace.define(
  "ace/theme/ZERO_ONE",
  ["require", "exports", "module"],
  function (require, exports, module) {
    module.exports = customTheme;
  }
);

export default customTheme;
