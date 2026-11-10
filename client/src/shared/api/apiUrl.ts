// Backend ka address. Pehle .env ki VITE_API_URL dekhta hai, warna local server
export const API_URL: string = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Server ka main address bina "/api" ke (vehicle images yahan se milti hain)
// e.g. "http://localhost:5000/api" -> "http://localhost:5000"
const SERVER_URL = API_URL.replace(/\/api\/?$/, '')

// Server ka diya hua file path (e.g. "/uploads/vehicles/car.jpg") poora link bana deta hai
export function getFileUrl(filePath: string): string {
  return SERVER_URL + filePath
}
