
interface NamingConvention {
  Users_1_000___: string;
  User_3_000___: string;
}

interface InputConfig {
  namingConvention: NamingConvention;
  isPersonal?: boolean; // Added optional flag
}

export function generatePersonalRoute(inputJsonString: string): string {
  const config: InputConfig = JSON.parse(inputJsonString);
  const { namingConvention, isPersonal } = config;

  const pluralName = namingConvention.Users_1_000___;
  const singularName = namingConvention.User_3_000___;

  const getPlural = `get${pluralName}`;
  const createSingular = `create${singularName}`;
  const updateSingular = `update${singularName}`;
  const deleteSingular = `delete${singularName}`;
  const getSingularById = `get${singularName}ById`;
  const bulkUpdatePlural = `bulkUpdate${pluralName}`;
  const bulkDeletePlural = `bulkDelete${pluralName}`;

  // define controller imports based on type
  const controllerImportsList = [
    getPlural,
    createSingular,
    updateSingular,
    deleteSingular,
    bulkUpdatePlural,
    bulkDeletePlural,
  ];

  if (!isPersonal) {
    controllerImportsList.push(getSingularById);
  }

  // Format the import list with indentation
  const controllerImportsString = controllerImportsList.join(',\n    ');

  // --- Logic Blocks ---

  // Imports Block
  const importsBlock = isPersonal
    ? `import { 
    ${controllerImportsString}
} from './controller';
import { formatResponse } from '@/app/api/utils/jwt-verify';`
    : `import { handleRateLimit } from '@/app/api/utils/rate-limit';
import {
    ${controllerImportsString}
} from './controller';

import {
    formatResponse,
//    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';`;

  // GET Logic
  const getLogic = isPersonal
    ? `const result = await ${getPlural}(req);
    return formatResponse(result.data, result.message, result.status);`
    : `const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//   if (tokenResponse) return tokenResponse;

    const id = new URL(req.url).searchParams.get('id');
    const result: IResponse = id
        ? await ${getSingularById}(req)
        : await ${getPlural}(req);
    return formatResponse(result.data, result.message, result.status);`;

  // POST Logic
  const postLogic = isPersonal
    ? `const result = await ${createSingular}(req);
    return formatResponse(result.data, result.message, result.status);`
    : `const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const result = await ${createSingular}(req);
    return formatResponse(result.data, result.message, result.status);`;

  // PUT Logic
  const putLogic = isPersonal
    ? `const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk 
        ? await ${bulkUpdatePlural}(req)
        : await ${updateSingular}(req);
    return formatResponse(result.data, result.message, result.status);`
    : `const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await ${bulkUpdatePlural}(req)
        : await ${updateSingular}(req);

    return formatResponse(result.data, result.message, result.status);`;

  // DELETE Logic
  const deleteLogic = isPersonal
    ? `const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await ${bulkDeletePlural}(req)
        : await ${deleteSingular}(req);
    return formatResponse(result.data, result.message, result.status);`
    : `const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await ${bulkDeletePlural}(req)
        : await ${deleteSingular}(req);

    return formatResponse(result.data, result.message, result.status);`;

  const routeTemplate = `
${importsBlock}

// GET all ${isPersonal ? pluralName : `${pluralName} or Single ${singularName} by ID`}
export async function GET(req: Request) {
    ${getLogic}
}

// CREATE ${singularName}
export async function POST(req: Request) {
    ${postLogic}
}

// UPDATE ${singularName}
export async function PUT(req: Request) {
    ${putLogic}
}

// DELETE ${singularName}
export async function DELETE(req: Request) {
    ${deleteLogic}
}
`;

  return routeTemplate.trim();
}