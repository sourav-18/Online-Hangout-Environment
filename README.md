# Online Hangout Environment

A simple multiplayer backend for a “Guess the Number (1–9)” game. Players can create rooms, play multiple rounds, send text/voice chat, and get real-time updates through Socket.IO. This project focuses only on business logic — no authentication and no input validation. It is a demo/test backend application.

## Run the Project

```bash
git clone https://github.com/sourav-18/Online-Hangout-Environment
cd Online-Hangout-Environment
docker compose up
```

Postman Collection:  
https://www.postman.com/cloudy-crescent-770366/workspace/online-hangout-api-socket

## Room Logic

- Create a room using the API and receive a roomId.  
- Connect to the socket using headers:
  - roomId
  - userId
- Guess a number from 1–9 in every round.  
- The server generates a new random number for each round.  
- All room and game data is stored in Redis for fast validation and quick updates.

## State Synchronization

- Room states: upcoming, live, completed  
- User states: idle, guessed, disconnected  
- If a user disconnects during a live game, they can reconnect and continue in same state

## Scaling Approach

Basic steps for handling high traffic:

- Redis used as the main in-memory game store and efficiently utilizes all server resources.  
- App is stateless, so multiple Node.js instances can run easily.  
- Use PM2 to distribute traffic across multiple Node.js instances on the same machine.  
- Enable autoscaling: scale up during peak traffic and scale down during low traffic to reduce server cost.  
- Horizontal scaling supported through multiple app servers running behind a load balancer.  
- Socket.IO scaling supported through Redis Pub/Sub.
