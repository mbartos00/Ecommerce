export function hasMessageProperty(obj: any): obj is { message: string } {
  return (
    typeof obj === 'object' && obj !== null && typeof obj.message === 'string'
  );
}
