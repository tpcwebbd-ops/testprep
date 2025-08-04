/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

// ! !!! -->> you can only GET, POST, PUT, DELETE, PATCH, OPTIONS and HEAD function.
// ! !!! -->> you can not use utils and other functions from here

// ! ./route.ts
import { formatResponse } from './apiUtils';
// ! GET
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const queryParams: Record<string, string | string[]> = {};
    searchParams.forEach((value, key) => {
      if (queryParams[key]) {
        if (Array.isArray(queryParams[key])) {
          (queryParams[key] as string[]).push(value);
        } else {
          queryParams[key] = [queryParams[key] as string, value];
        }
      } else {
        queryParams[key] = value;
      }
    });

    const responseData = {
      receivedQuery: queryParams,
      data: [],
    };

    return formatResponse(responseData, 'Data retrieved successfully via GET', 200);
  } catch (error) {
    console.error('GET Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return formatResponse({ error: errorMessage }, 'Error processing GET request', 500);
  }
}

// ! POST
export async function POST(req: Request) {
  try {
    const reqData = await req.json();
    return formatResponse(reqData, 'Data received successfully via POST', 200);
  } catch (error) {
    console.error('POST Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Invalid request body';

    if (error instanceof SyntaxError) {
      return formatResponse({ error: 'Invalid JSON format in request body.' }, 'Failed to parse request body', 400);
    }
    if (errorMessage.includes('Unexpected end of JSON input') || errorMessage.includes('missing request body')) {
      return formatResponse({ error: 'Request body is missing or empty.' }, 'Failed to parse request body', 400);
    }
    return formatResponse({ error: errorMessage }, 'Failed to parse request body or other error', 400);
  }
}

// ! PUT
export async function PUT(req: Request) {
  try {
    const reqData = await req.json();
    return formatResponse(reqData, 'Data updated successfully via PUT', 200);
  } catch (error) {
    console.error('PUT Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Invalid request body';

    if (error instanceof SyntaxError) {
      return formatResponse({ error: 'Invalid JSON format in request body.' }, 'Failed to parse request body', 400);
    }
    if (errorMessage.includes('Unexpected end of JSON input') || errorMessage.includes('missing request body')) {
      return formatResponse({ error: 'Request body is missing or empty.' }, 'Failed to parse request body', 400);
    }
    return formatResponse({ error: errorMessage }, 'Failed to parse request body or other error', 400);
  }
}

// !DELETE
export async function DELETE(req: Request) {
  try {
    const reqData: { id?: string } = await req.json();

    if (typeof reqData.id === 'undefined') {
      return formatResponse({ error: "Missing 'id' in request body" }, 'Error processing DELETE request: ID missing', 400);
    }

    const responseData = { deletedId: reqData.id, status: 'successfully deleted (simulated)' };

    return formatResponse(responseData, `Resource with id: ${reqData.id} processed for deletion via DELETE`, 200);
  } catch (error) {
    console.error('DELETE Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    if (error instanceof SyntaxError) {
      return formatResponse({ error: 'Invalid JSON format in request body.' }, 'Failed to parse request body', 400);
    }
    if (errorMessage.includes('Unexpected end of JSON input') || errorMessage.includes('missing request body')) {
      return formatResponse({ error: 'Request body is missing or empty.' }, 'Failed to parse request body', 400);
    }
    return formatResponse({ error: errorMessage }, 'Error processing DELETE request', 500);
  }
}
