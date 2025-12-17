// #!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import https from 'https';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Utility functions
const toPascalCase = (str) => {
  return str
    .split(/[-_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
};

const toKebabCase = (str) => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
};

// Fetch component from shadcn/ui
const fetchShadcnComponent = (componentName) => {
  return new Promise((resolve, reject) => {
    const url = `https://ui.shadcn.com/r/styles/default/${componentName}.json`;
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            resolve(json);
          } catch (e) {
            reject(new Error('Failed to parse shadcn component data'));
          }
        } else {
          reject(new Error(`Component not found: ${componentName}`));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
};

// Generate index file
const generateIndexFile = (pascalName, kebabName) => {
  return `export * from './${kebabName}';
`;
};

// Main function
async function generateComponent(componentName, options = {}) {
  const {
    basePath = './src/shared/ui',
    fromShadcn = true,
  } = options;

  const pascalName = toPascalCase(componentName);
  const kebabName = toKebabCase(componentName);
  const componentDir = path.join(basePath, kebabName);

  try {
    // Create directory
    if (!fs.existsSync(componentDir)) {
      fs.mkdirSync(componentDir, { recursive: true });
      console.log(`✓ Created directory: ${componentDir}`);
    } else {
      console.log(`⚠ Directory already exists: ${componentDir}`);
    }

    let componentContent;

    if (fromShadcn) {
        console.log(`📦 Adding ${componentName} via shadcn CLI...`);

        // Try to use the shadcn CLI to add the component directly into our target folder
        try {
          const args = ['--yes', 'shadcn@latest', 'add', kebabName, '-y', '-p', componentDir, '-o'];
          const result = spawnSync('npx', args, { encoding: 'utf8' });

          if (result.error) {
            throw result.error;
          }

          if (result.status !== 0) {
            console.log(result.stdout || result.stderr);
            throw new Error('shadcn CLI failed to add component');
          }

          console.log(result.stdout || result.stderr || `✓ shadcn CLI added ${kebabName}`);

          // Find the main component file inside componentDir
          const files = fs.readdirSync(componentDir).filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));
          if (files.length === 0) {
            throw new Error('No component files were created by shadcn CLI');
          }

          // Pick a reasonable candidate: kebabName.tsx or the first .tsx
          let mainFile = files.find(f => f.includes(`${kebabName}`) && f.endsWith('.tsx')) || files.find(f => f.endsWith('.tsx')) || files[0];
          const mainPath = path.join(componentDir, mainFile);
          componentContent = fs.readFileSync(mainPath, 'utf8');

          // Normalize known import path for `cn` util used by shadcn components
          componentContent = componentContent.replace(
            /from "@\/lib\/utils"|from '\@\/lib\/utils'|from "@\/lib\/utils"/g,
            'from "shared/lib/utils"'
          );

          // Write back normalized main file
          fs.writeFileSync(mainPath, componentContent, 'utf8');
          console.log(`✓ Normalized imports in ${mainPath}`);

        } catch (cliErr) {
          console.log(`⚠ shadcn CLI failed: ${cliErr.message}. Falling back to registry fetch...`);
          const shadcnData = await fetchShadcnComponent(kebabName);

          // Find the main component file
          const componentFile = shadcnData.files.find(f => 
            f.type === 'registry:ui' || 
            f.type === 'registry:component' ||
            f.path.includes(`${kebabName}.tsx`)
          );

          if (componentFile && componentFile.content) {
            componentContent = componentFile.content;
            // Replace the cn import path
            componentContent = componentContent.replace(
              'import { cn } from "@/lib/utils"',
              'import { cn } from "shared/lib/utils"'
            );
            console.log(`✓ Fetched component from shadcn registry`);

            // Log dependencies if any
            if (shadcnData.dependencies && shadcnData.dependencies.length > 0) {
              console.log(`\n📦 Dependencies found:`);
              shadcnData.dependencies.forEach(dep => console.log(`   - ${dep}`));
            }
          } else {
            throw new Error('Component content not found in shadcn data');
          }
        }
    } else {
      // Generate custom template
      componentContent = `import React from 'react';
import { cn } from '@/lib/utils';

export interface ${pascalName}Props extends React.HTMLAttributes<HTMLDivElement> {
  // Add your props here
}

export function ${pascalName}({ className, ...props }: ${pascalName}Props) {
  return (
    <div className={cn("", className)} {...props}>
      {/* Component content */}
      <p>Your ${pascalName} component</p>
    </div>
  );
}
`;
    }

    // Generate index.tsx
    const indexPath = path.join(componentDir, 'index.tsx');
    const indexContent = generateIndexFile(pascalName, kebabName);
    fs.writeFileSync(indexPath, indexContent);
    console.log(`✓ Created: ${indexPath}`);

    // Generate component file
    const componentPath = path.join(componentDir, `${kebabName}.tsx`);
    fs.writeFileSync(componentPath, componentContent);
    console.log(`✓ Created: ${componentPath}`);

    // Update ./src/shared/ui/index.tsx
    const sharedUiIndexPath = './src/shared/ui/index.tsx';
    const exportLine = `export * from "./${kebabName}";\n`;
    
    try {
      if (fs.existsSync(sharedUiIndexPath)) {
        const currentContent = fs.readFileSync(sharedUiIndexPath, 'utf8');
        if (!currentContent.includes(`export * from "./${kebabName}"`)) {
          fs.appendFileSync(sharedUiIndexPath, exportLine);
          console.log(`✓ Updated: ${sharedUiIndexPath}`);
        } else {
          console.log(`⚠ Export already exists in ${sharedUiIndexPath}`);
        }
      } else {
        // Create the file if it doesn't exist
        const dir = path.dirname(sharedUiIndexPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(sharedUiIndexPath, exportLine);
        console.log(`✓ Created and updated: ${sharedUiIndexPath}`);
      }
    } catch (error) {
      console.log(`⚠ Could not update ${sharedUiIndexPath}: ${error.message}`);
    }

    console.log(`\n✨ Component "${pascalName}" generated successfully!`);
    console.log(`\nImport with:`);
    console.log(`import { ${pascalName} } from '@/components/${kebabName}';`);

    if (fromShadcn) {
      console.log(`\n⚠️  Remember to:`);
      console.log(`   1. Install dependencies if needed`);
      console.log(`   2. If needed, re-run: npx --yes shadcn@latest add <component> -p <path> -o`);
      console.log(`   3. Ensure you have shared/lib/utils with cn() function`);
    }

  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    if (fromShadcn) {
      console.log(`\n💡 Available shadcn components include:`);
      console.log(`   button, card, input, dialog, alert, badge, select,`);
      console.log(`   dropdown-menu, accordion, avatar, checkbox, switch,`);
      console.log(`   tabs, toast, tooltip, and many more...`);
      console.log(`\n   Visit https://ui.shadcn.com/docs/components for the full list`);
    }
    process.exit(1);
  }
}

// CLI Usage
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Usage: node generate-component.js <component-name> [options]');
  console.log('\nOptions:');
  console.log('  --shadcn       Add component using shadcn CLI (npx shadcn@latest add)');
  console.log('  --path <path>  Custom base path (default: ./src/shared/ui)');
  console.log('\nExamples:');
  console.log('  node generate-component.js UserProfile');
  console.log('  node generate-component.js button --shadcn');
  console.log('  node generate-component.js card --shadcn --path ./src/components');
  console.log('\nShadcn components: button, card, input, dialog, alert, badge, etc.');
  console.log('Visit: https://ui.shadcn.com/docs/components');
  process.exit(1);
}

const componentName = args[0];
const options = {
  fromShadcn: true,
  basePath: args.includes('--path') ? args[args.indexOf('--path') + 1] : './src/shared/ui',
};

generateComponent(componentName, options);

export { generateComponent, toPascalCase, toKebabCase };