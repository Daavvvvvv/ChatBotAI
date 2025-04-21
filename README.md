
Fullstack application integrating generative AI capabilities with a modern architecture using Spring Boot and Next.js

## Features


- **Multi-model support**: Integrates with various AI models including OpenAI (GPT-3.5, GPT-4o) and Ollama (Qwen, Deepseek)
- **Specialized assistants**: Choose from different assistant types (Software Engineer, Mathematics, Car Expert, Sports, Travel)
- **Real-time chat interface**: Intuitive chat UI with message history and loading states
- **Responsive design**: Works on desktop and mobile devices
- **Theme support**: Light and dark mode support (theme toggle included)
- **User feedback system**: Integration ready for collecting user feedback on AI responses

## Tech Stack

### Frontend

- **Next.js**: React framework with TypeScript
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Component library with Radix UI primitives
- **Lucide React**: Icon library

### Backend

- **Spring Boot**: Java-based backend framework
- **Spring AI**: Integration with AI service providers
- **JPA/Hibernate**: Database ORM
- **Lombok**: Java library to reduce boilerplate code

### AI Integration

- **OpenAI API**: Integration with GPT models
- **Ollama**: Local AI model integration


## Architecture

![[RevAisor Architecture.pdf]]

This architecture provides several advantages:

- **Model Agnostic**: Abstraction layers allow easy integration of different AI providers
- **Extensibility**: New models can be added with minimal changes to the codebase
- **Specialized Assistants**: Multiple AI personalities through templated prompts
- **Separation of Concerns**: Clear boundaries between UI, API, and AI service layers


## Setup Instructions


### Prerequisites

- Docker and Docker Compose
- Internet Connection
- 8GB+ Ram for Ollama Models
- OpenAI API Key

1. Clone the repository with

```
git clone https://github.com/Daavvvvvv/ChatBotAI
```


2. Create a .env file in the directory with the following content

```
# Database configuration 
DATABASE_USER=your_database_username 
DATABASE_PASSWORD=your_database_password 

# Required for OpenAI models (if using) 
OPENAI_API_KEY=your_openai_api_key 
OPENAI_ORG_ID=your_openai_org_id 
OPENAI_PROJECT_ID=your_openai_project_id 

# Optional configuration 
SPRING_PROFILES_ACTIVE=prod
```
``

3. Allow permissions in the terminal to the init-ollama.sh

```
chmod +x ollama/init-ollama.sh
```

4. Start all services using Docker Compose

```
docker-compose up -d
```

This will:

- Build and start the Spring Boot backend
- Build and start the Next.js frontend
- Start Ollama and download the required models (which may take some time on first run)

you can check the services with

```
docker-compose logs -f
```

and now you can access the application locally with

http://localhost:3000

when you want to stop the application you can use this command

```
docker-compose down -v
```


## Troubleshooting

- **Ollama models not loading**: Check the Ollama container logs with `docker-compose logs ollama`
- **Backend can't connect to Ollama**: Ensure the Ollama container has fully initialized before the backend attempts to connect
- **Frontend can't connect to backend**: Verify the NEXT_PUBLIC_API_URL environment variable is set correctly
- **Database connection issues**: Make sure the DATABASE_USER and DATABASE_PASSWORD environment variables are properly set in your .env file
- **H2 Console access**: When the application is running, you can access the H2 database console at [http://localhost:8080/h2-console](http://localhost:8080/h2-console) (use jdbc:h2:file:./data/feedback-db as the JDBC URL)


## Challenges Faced

During all this project there were severall challenges that i faced, for example, in the beginning i tried just to do this app with ollama, and it was not that much documentation for ollama services, but i could at the end, and because i wanted to learn more, i desing an abstract class, so i can implement more and more AI when i want and easier.

It was really hard for me to desing the frontend, but with AI and using shadcn components i could do it the best possible.

When i was doing the deployment and using docker, it was hard to use Ollama, but at the end, i could setted up and now is working correctly

