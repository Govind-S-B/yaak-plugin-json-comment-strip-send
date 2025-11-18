import { describe, expect, test } from 'vitest';
import { stripJSONComments } from './index';

describe('stripJSONComments', () => {
  test('removes single-line comments', () => {
    const input = `{
  // This is a comment
  "key": "value"
}`;
    const expected = `{
  
  "key": "value"
}`;
    expect(stripJSONComments(input)).toBe(expected);
  });

  test('removes multiple single-line comments', () => {
    const input = `{
  // Comment 1
  "key1": "value1",
  // Comment 2
  "key2": "value2" // Inline comment
}`;
    const expected = `{
  
  "key1": "value1",
  
  "key2": "value2" 
}`;
    expect(stripJSONComments(input)).toBe(expected);
  });

  test('removes multi-line comments', () => {
    const input = `{
  /* This is a
     multi-line
     comment */
  "key": "value"
}`;
    const expected = `{
  
  "key": "value"
}`;
    expect(stripJSONComments(input)).toBe(expected);
  });

  test('removes mixed comment styles', () => {
    const input = `{
  // Single line comment
  "key1": "value1",
  /* Multi-line
     comment */
  "key2": "value2"
}`;
    const expected = `{
  
  "key1": "value1",
  
  "key2": "value2"
}`;
    expect(stripJSONComments(input)).toBe(expected);
  });

  test('preserves comments inside string values', () => {
    const input = `{
  "url": "https://example.com/path?q=test",
  "comment": "This // is not a comment",
  "description": "Use /* stars */ for emphasis"
}`;
    expect(stripJSONComments(input)).toBe(input);
  });

  test('preserves escaped quotes in strings', () => {
    const input = `{
  "quote": "She said \\"Hello\\"",
  "path": "C:\\\\Program Files\\\\App"
}`;
    expect(stripJSONComments(input)).toBe(input);
  });

  test('handles complex nested JSON with comments', () => {
    const input = `{
  // User information
  "user": {
    "name": "John Doe", // Full name
    /* Contact details */
    "email": "john@example.com"
  },
  // Settings
  "settings": {
    "theme": "dark" // Preferred theme
  }
}`;
    const expected = `{
  
  "user": {
    "name": "John Doe", 
    
    "email": "john@example.com"
  },
  
  "settings": {
    "theme": "dark" 
  }
}`;
    expect(stripJSONComments(input)).toBe(expected);
  });

  test('handles comments at start and end of file', () => {
    const input = `// Start comment
{
  "key": "value"
}
// End comment`;
    const expected = `
{
  "key": "value"
}
`;
    expect(stripJSONComments(input)).toBe(expected);
  });

  test('handles empty input', () => {
    expect(stripJSONComments('')).toBe('');
  });

  test('handles input with no comments', () => {
    const input = `{
  "key": "value",
  "array": [1, 2, 3],
  "nested": {
    "inner": true
  }
}`;
    expect(stripJSONComments(input)).toBe(input);
  });

  test('handles comments with special characters', () => {
    const input = `{
  // Comment with special chars: @#$%^&*()
  "key": "value",
  /* Another comment with <html> tags */
  "html": "<div>content</div>"
}`;
    const expected = `{
  
  "key": "value",
  
  "html": "<div>content</div>"
}`;
    expect(stripJSONComments(input)).toBe(expected);
  });

  test('handles consecutive comments', () => {
    const input = `{
  // Comment 1
  // Comment 2
  // Comment 3
  "key": "value"
}`;
    const expected = `{
  
  
  
  "key": "value"
}`;
    expect(stripJSONComments(input)).toBe(expected);
  });

  test('handles URL-like strings that contain //', () => {
    const input = `{
  "website": "https://example.com",
  "api": "http://api.example.com/v1/users"
}`;
    expect(stripJSONComments(input)).toBe(input);
  });

  test('strips comments but preserves JSON structure', () => {
    const input = `{
  // API Configuration
  "apiUrl": "https://api.example.com",
  /* 
   * Authentication token
   * Generated: 2024-01-01
   */
  "token": "abc123" // Secret token
}`;
    const result = stripJSONComments(input);
    // Should be valid JSON after comment removal
    expect(() => JSON.parse(result)).not.toThrow();
  });

  test('handles comments with asterisks in different positions', () => {
    const input = `{
  /* * * * * */
  "key": "value",
  /** Documentation style **/
  "another": "value"
}`;
    const expected = `{
  
  "key": "value",
  
  "another": "value"
}`;
    expect(stripJSONComments(input)).toBe(expected);
  });

  test('handles inline comments on same line as JSON', () => {
    const input = `{
  "key1": "value1", // Comment after value
  "key2": "value2" /* inline block comment */
}`;
    const expected = `{
  "key1": "value1", 
  "key2": "value2" 
}`;
    expect(stripJSONComments(input)).toBe(expected);
  });

  test('real-world example: API request body', () => {
    const input = `{
  // User registration payload
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secure123", // TODO: Use environment variable
  
  /* Optional fields */
  "firstName": "John",
  "lastName": "Doe",
  
  // Preferences
  "preferences": {
    "newsletter": true, // Opt-in for marketing emails
    "notifications": {
      "email": true,
      "sms": false // Disable SMS for now
    }
  }
}`;
    const result = stripJSONComments(input);
    
    // Verify it's valid JSON
    expect(() => JSON.parse(result)).not.toThrow();
    
    // Verify structure is preserved
    const parsed = JSON.parse(result);
    expect(parsed.username).toBe('john_doe');
    expect(parsed.preferences.notifications.email).toBe(true);
  });
});
