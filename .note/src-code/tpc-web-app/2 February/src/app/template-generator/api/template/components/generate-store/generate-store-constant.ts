interface Schema {
  [key: string]: string | Schema;
}

interface NamingConvention {
  Users_1_000___: string;
  users_2_000___: string;
  User_3_000___: string;
  user_4_000___: string;
  bulk_action?: string[]; // Added optional bulk_action
  use_generate_folder?: boolean;
  [key: string]: unknown;
}

interface InputConfig {
  uid: string;
  templateName: string;
  schema: Schema;
  namingConvention: NamingConvention;
}

const generateStoreConstant = (inputJson: string): string => {
  const config: InputConfig = JSON.parse(inputJson);
  const { namingConvention, schema } = config;

  // Extract Naming Conventions
  const pluralLowerCase = namingConvention.users_2_000___; // e.g., "posts"
  const singularCapitalized = namingConvention.User_3_000___; // e.g., "Post" (used for default values)
  const bulkActions = namingConvention.bulk_action || [];

  // 1. Default values if no SELECT is found
  let selectorArr = [`Store ${singularCapitalized} 1`, `Store ${singularCapitalized} 2`, `Store ${singularCapitalized} 3`];

  // 2. Iterate through bulk_action to find a SELECT field
  if (Array.isArray(bulkActions)) {
    for (const actionKey of bulkActions) {
      const schemaType = schema[actionKey];

      // 3. Check if the schema item is a string and is a SELECT type
      if (typeof schemaType === 'string' && schemaType.startsWith('SELECT#')) {
        // 5. Extract string after # (e.g., "Bangladesh, India, Pakistan, Canada")
        const optionsString = schemaType.split('#')[1];

        if (optionsString) {
          // Convert comma-separated string to array and trim whitespace
          selectorArr = optionsString.split(',').map(opt => opt.trim());
          // We found our selector, break the loop (assuming we only want the first valid one)
          break;
        }
      }
    }
  }

  // Helper to format array with single quotes to match example output exactly
  const formattedSelectorArr = JSON.stringify(selectorArr).replace(/"/g, "'");

  // 6. Render result
  const result = `
    export const defaultPageNumber = 2;
export const queryParams = { q: '', page: 1, limit: defaultPageNumber };
export const pageLimitArr = [defaultPageNumber, 20, 30, 40, 50];
export const  ${pluralLowerCase}SelectorArr  = ${formattedSelectorArr};

    `;
  return result;
};

export default generateStoreConstant;
