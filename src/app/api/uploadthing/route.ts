import { createRouteHandler } from 'uploadthing/next'; // Updated import

import { ourFileRouter } from './core';

// Use createRouteHandler instead of createNextRouteHandler
export const { GET, POST } = createRouteHandler({ router: ourFileRouter });
