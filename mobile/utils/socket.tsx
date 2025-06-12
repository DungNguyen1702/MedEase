// socket.js
import { io } from 'socket.io-client';

const socket = io(process.env.EXPO_PUBLIC_API_URL); // Không dùng localhost nếu chạy trên thiết bị thật
export default socket;
