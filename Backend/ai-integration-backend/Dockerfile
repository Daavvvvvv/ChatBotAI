FROM maven:3.9.9 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM openjdk:23-jdk-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]