import type { Context, HttpRequest, PluginDefinition } from '@yaakapp/api';

/**
 * Strip comments from a JSON string
 * 
 * This regex pattern handles:
 * - Single-line comments (//)
 * - Multi-line comments
 * - Preserves comments within string literals
 * 
 * @param data - JSON string with comments
 * @returns JSON string without comments
 */
export function stripJSONComments(data: string): string {
  return data.replace(
    /\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g,
    (m, g) => g ? "" : m
  );
}

/**
 * Check if the body type is application/json and should be processed
 */
function shouldProcessBody(bodyType: string | null | undefined): boolean {
  // Only process application/json body types
  return bodyType === 'application/json';
}

export const plugin: PluginDefinition = {
  httpRequestActions: [
    {
      label: 'Send (Strip Comments)',
      icon: 'check_circle',
      async onSelect(ctx: Context, args: { httpRequest: HttpRequest }) {
        try {
          // 1. Render the request (processes template tags and variables)
          const renderedRequest = await ctx.httpRequest.render({
            httpRequest: args.httpRequest,
            purpose: 'send',
          });

          // 2. Strip comments from body if it's application/json
          if (renderedRequest.body?.text && shouldProcessBody(renderedRequest.bodyType)) {
            const originalText = renderedRequest.body.text;
            const strippedText = stripJSONComments(originalText);
            
            // Only update if comments were actually stripped (to avoid unnecessary processing)
            if (originalText !== strippedText) {
              renderedRequest.body.text = strippedText;
            }
          }

          // 3. Send the modified request
          const response = await ctx.httpRequest.send({
            httpRequest: renderedRequest,
          });

          // 4. Show success/error toast based on response status
          const isSuccess = response.status >= 200 && response.status < 300;
          const statusText = response.statusReason || response.status.toString();
          
          await ctx.toast.show({
            message: `${response.status} ${statusText}`,
            color: isSuccess ? 'success' : 'danger',
            icon: isSuccess ? 'check_circle' : 'alert_triangle',
          });
        } catch (error) {
          // Handle any errors during render or send
          const errorMessage = error instanceof Error ? error.message : String(error);
          
          await ctx.toast.show({
            message: `Failed to send request: ${errorMessage}`,
            color: 'danger',
            icon: 'alert_triangle',
          });
        }
      },
    },
  ],
};
