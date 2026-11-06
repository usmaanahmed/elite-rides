// Server ke jawab ko JSON me badalta hai. Agar server ne error bheja to us ka message error bana deta hai
export async function readJsonResponse(response: Response): Promise<unknown> {
  const data: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    let message = 'Something went wrong. Please try again.'
    if (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string') {
      message = data.message
    }
    throw new Error(message)
  }

  return data
}
