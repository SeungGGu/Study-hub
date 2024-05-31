// import { useRef, useState, useCallback, useEffect } from 'react';
// import Stomp from 'stompjs';
// import SockJS from 'sockjs-client';
//
// const useWebSocket = (url, onMessage) => {
//     const stompClientRef = useRef(null);
//     const [connected, setConnected] = useState(false);
//     const [retryCount, setRetryCount] = useState(0);
//     const connectingRef = useRef(false); // 연결 시도를 추적하는 ref
//
//     const connect = useCallback(() => {
//         if (connectingRef.current) return;
//         connectingRef.current = true;
//
//         const socket = new SockJS(url);
//         const client = Stomp.over(socket);
//
//         client.connect({}, () => {
//             console.log('웹소켓 연결 성공');
//             stompClientRef.current = client;
//             setConnected(true);
//             setRetryCount(0);
//             connectingRef.current = false;
//
//             client.subscribe('/topic/messages', (message) => {
//                 onMessage(JSON.parse(message.body));
//             });
//         }, (error) => {
//             console.error('웹소켓 연결 오류:', error);
//             connectingRef.current = false;
//             if (retryCount < 5) {
//                 setTimeout(() => {
//                     setRetryCount(prevCount => prevCount + 1);
//                     connect();
//                 }, 5000);
//             } else {
//                 console.error('최대 재시도 횟수에 도달했습니다. 연결 실패.');
//             }
//         });
//     }, [url, onMessage, retryCount]);
//
//     const disconnect = useCallback(() => {
//         if (stompClientRef.current) {
//             stompClientRef.current.disconnect(() => {
//                 console.log('웹소켓 연결 종료됨');
//                 setConnected(false);
//             }, () => {
//                 console.error('웹소켓 연결 종료 오류');
//             });
//         }
//     }, []);
//
//     const sendMessage = useCallback((destination, message) => {
//         if (stompClientRef.current && connected) {
//             stompClientRef.current.send(destination, {}, JSON.stringify(message));
//         } else {
//             console.warn('웹소켓이 연결되어 있지 않습니다. 메시지를 전송할 수 없습니다.');
//         }
//     }, [connected]);
//
//     useEffect(() => {
//         connect();
//         return () => {
//             disconnect();
//         };
//     }, [connect, disconnect]);
//
//     return { connect, disconnect, sendMessage, connected };
// };
//
// export default useWebSocket;
