FROM node:20 AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM node:20 AS runner
WORKDIR /app
COPY --from=build /app ./
EXPOSE 3000
CMD ["npm", "start"]