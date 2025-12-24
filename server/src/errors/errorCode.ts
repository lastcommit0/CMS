export const ErrorCode = {
  AUTH_INVALID_CREDENTIALS: { code: 'AUTH_INVALID_CREDENTIALS', statusCode: 401, message: 'Invalid email or password' },
  AUTH_TOKEN_EXPIRED: { code: 'AUTH_TOKEN_EXPIRED', statusCode: 401, message: 'Session expired, Please login again' },
  AUTH_REFRESH_EXPIRED: { code: 'AUTH_REFRESH_EXPIRED', statusCode: 401, message: 'Refresh token is expired. Please login again' },
  AUTH_TOKEN_INVALID: { code: 'AUTH_TOKEN_INVALID', statusCode: 401, message: 'Invalid authentication token' },
  AUTH_TOKEN_MISSING: { code: 'AUTH_TOKEN_MISSING', statusCode: 401, message: 'Authentication token is required' },
  AUTH_OAUTH_FAILED: { code: 'AUTH_OAUTH_FAILED', statusCode: 401, message: 'OAuth authentication failed' },
  AUTH_ACCOUNT_DISABLED: { code: 'AUTH_ACCOUNT_DISABLED', statusCode: 403, message: 'Account has been suspended or deactivated' },

  ROLE_ACCESS_DENIED: { code: 'ROLE_ACCESS_DENIED', statusCode: 403, message: 'Insufficient permissions to perform this action' },
  ROLE_ADMIN_REQUIRED: { code: 'ROLE_ADMIN_REQUIRED', statusCode: 403, message: 'Admin access required' },
  ROLE_EDITOR_REQUIRED: { code: 'ROLE_EDITOR_REQUIRED', statusCode: 403, message: 'Editor access required' },

  USER_NOT_FOUND: { code: 'USER_NOT_FOUND', statusCode: 404, message: 'User not found' },
  USER_EMAIL_EXISTS: { code: 'USER_EMAIL_EXISTS', statusCode: 409, message: 'Email already registered' },
  USER_ALREADY_EXISTS: { code: 'USER_ALREADY_EXISTS', statusCode: 409, message: 'User already exists' },
  USER_PHONE_EXISTS: { code: 'USER_PHONE_EXISTS', statusCode: 409, message: 'Phone number already registered' },
  USER_INACTIVE: { code: 'USER_INACTIVE', statusCode: 403, message: 'User account is inactive' },
  USER_CANNOT_DELETE_SELF: { code: 'USER_CANNOT_DELETE_SELF', statusCode: 400, message: 'Cannot delete your own account' },

  STORY_NOT_FOUND: { code: 'STORY_NOT_FOUND', statusCode: 404, message: 'Story not found' },
  STORY_TITLE_REQUIRED: { code: 'STORY_TITLE_REQUIRED', statusCode: 400, message: 'Story title is required' },
  STORY_SLUG_CONFLICT: { code: 'STORY_SLUG_CONFLICT', statusCode: 409, message: 'Story slug already exists' },
  STORY_ALREADY_PUBLISHED: { code: 'STORY_ALREADY_PUBLISHED', statusCode: 409, message: 'Story is already published' },
  STORY_EDIT_LOCKED: { code: 'STORY_EDIT_LOCKED', statusCode: 423, message: 'Story is currently being edited by another user' },

  CATEGORY_NOT_FOUND: { code: 'CATEGORY_NOT_FOUND', statusCode: 404, message: 'Category not found' },
  CATEGORY_NAME_DUPLICATE: { code: 'CATEGORY_NAME_DUPLICATE', statusCode: 409, message: 'Category name already exists' },
  CATEGORY_SLUG_DUPLICATE: { code: 'CATEGORY_SLUG_DUPLICATE', statusCode: 409, message: 'Category slug already exists' },
  CATEGORY_PARENT_INVALID: { code: 'CATEGORY_PARENT_INVALID', statusCode: 400, message: 'Invalid parent category' },
  CATEGORY_HAS_CHILDREN: { code: 'CATEGORY_HAS_CHILDREN', statusCode: 409, message: 'Cannot delete category with subcategories' },
  CATEGORY_CIRCULAR_REFERENCE: { code: 'CATEGORY_CIRCULAR_REFERENCE', statusCode: 400, message: 'Cannot set a descendant as parent' },
  

  PRIORITY_INVALID_ZONE: { code: 'PRIORITY_INVALID_ZONE', statusCode: 400, message: 'Invalid priority zone' },
  PRIORITY_ALREADY_ASSIGNED: { code: 'PRIORITY_ALREADY_ASSIGNED', statusCode: 409, message: 'Another story already occupies this slot' },
  PRIORITY_PERMISSION_DENIED: { code: 'PRIORITY_PERMISSION_DENIED', statusCode: 403, message: 'You do not have permission to manage priorities' },

  POLL_NOT_FOUND: { code: 'POLL_NOT_FOUND', statusCode: 404, message: 'Poll not found' },
  POLL_CLOSED: { code: 'POLL_CLOSED', statusCode: 409, message: 'Poll is closed for voting' },
  POLL_EXPIRED: { code: 'POLL_EXPIRED', statusCode: 409, message: 'Poll has expired' },
  POLL_DUPLICATE_VOTE: { code: 'POLL_DUPLICATE_VOTE', statusCode: 409, message: 'You have already voted in this poll' },
  POLL_OPTION_INVALID: { code: 'POLL_OPTION_INVALID', statusCode: 400, message: 'Invalid poll option' },
  POLL_MIN_OPTIONS: { code: 'POLL_MIN_OPTIONS', statusCode: 400, message: 'Poll must have at least 2 options' },

  META_TAG_INVALID: { code: 'META_TAG_INVALID', statusCode: 400, message: 'Invalid meta tag format' },
  META_DUPLICATE: { code: 'META_DUPLICATE', statusCode: 409, message: 'Meta tags already exist for this story' },
  META_REQUIRED_MISSING: { code: 'META_REQUIRED_MISSING', statusCode: 400, message: 'Required meta tags are missing' },

  SECTION_NOT_FOUND: { code: 'SECTION_NOT_FOUND', statusCode: 404, message: 'Section not found' },
  SECTION_SLUG_DUPLICATE: { code: 'SECTION_SLUG_DUPLICATE', statusCode: 409, message: 'Section slug already exists' },
  SECTION_HAS_STORIES: { code: 'SECTION_HAS_STORIES', statusCode: 409, message: 'Cannot delete section with stories' },

  FILE_TOO_LARGE: { code: 'FILE_TOO_LARGE', statusCode: 413, message: 'File size exceeds maximum limit' },
  FILE_TYPE_UNSUPPORTED: { code: 'FILE_TYPE_UNSUPPORTED', statusCode: 415, message: 'File type not supported' },
  FILE_UPLOAD_FAILED: { code: 'FILE_UPLOAD_FAILED', statusCode: 500, message: 'File upload failed' },

  REPORT_EMPTY: { code: 'REPORT_EMPTY', statusCode: 404, message: 'No data available for this report' },
  REPORT_GENERATION_FAILED: { code: 'REPORT_GENERATION_FAILED', statusCode: 500, message: 'Report generation failed' },
  REPORT_PERMISSION_DENIED: { code: 'REPORT_PERMISSION_DENIED', statusCode: 403, message: 'You do not have permission to generate reports' },

  SYSTEM_DATABASE_ERROR: { code: 'SYSTEM_DATABASE_ERROR', statusCode: 500, message: 'Database operation failed' },
  SYSTEM_RATE_LIMIT: { code: 'SYSTEM_RATE_LIMIT', statusCode: 429, message: 'Too many requests. Please try again later.' },
  SYSTEM_SERVICE_UNAVAILABLE: { code: 'SYSTEM_SERVICE_UNAVAILABLE', statusCode: 503, message: 'Service temporarily unavailable' },
  SYSTEM_VALIDATION_ERROR: { code: 'SYSTEM_VALIDATION_ERROR', statusCode: 400, message: 'Validation failed' },
  SYSTEM_INTERNAL_ERROR: { code: 'SYSTEM_INTERNAL_ERROR', statusCode: 500, message: 'An unexpected error occurred' }
}