# DalVacation Home

## Description

DalVacation Home is a multi-cloud hospitality platform designed for Dalhousie University, integrating AWS and Google Cloud services to deliver a seamless user experience. The platform includes features such as user management, chatbot functionality, real-time data visualization, and effective communication channels between customers and property agents.

## Tech Stack

- **Frontend**: React, HTML, CSS
- **Authentication**: AWS Cognito
- **Chatbot**: Google Dialogflow
- **Data Visualization**: Looker Studio
- **Message Broker**: Google Pub/Sub
- **CI/CD**: Google Cloud Build, Cloud Run

## Features

1. **User Authentication**
   - **Tech Used**: AWS Cognito
   - **Description**: Enables secure user sign-up and sign-in processes, ensuring that user data is protected and managed effectively.
   - **User Path**: Utilizes AWS Cognito for user registration, login, and multi-factor authentication (MFA) with security questions and Caesar cipher challenges.

2. **Chatbot Interaction**
   - **Tech Used**: Google Dialogflow
   - **Description**: Provides users with a conversational interface to get quick answers and support through an AI-driven chatbot.
   - **Implementation**: Developed a chatbot using Google Dialogflow to assist users with navigation and booking inquiries.

3. **Data Visualization**
   - **Tech Used**: Looker Studio
   - **Description**: Offers interactive dashboards and reports for users to visualize data trends and insights, enhancing decision-making capabilities.
   - **Implementation**: Visualizes application data through dashboards, providing insights into user interactions and platform performance.

4. **Real-time Communication**
   - **Tech Used**: Google Pub/Sub
   - **Description**: Facilitates real-time messaging between the chat agent and users, ensuring that interactions are smooth and timely.
   - **Implementation**: Integrated GCP Pub/Sub for handling messages between customers and property agents, where customer concerns are published to a topic.

5. **Frontend Development**
   - **Tech Used**: React
   - **Description**: A responsive and dynamic user interface that enhances user experience through interactive components and seamless navigation.
   - **Implementation**: Utilized React to build the front end of the application, ensuring a user-friendly interface.

6. **Continuous Integration and Deployment (CI/CD)**
   - **Tech Used**: Google Cloud Build, Cloud Run
   - **Description**: Automates testing and deployment processes, ensuring that the latest features are delivered reliably and efficiently.
   - **Implementation**: Implemented CI/CD pipelines for automated deployment, simplifying the workflow.

## Getting Started

To get started with this project, follow these steps:

### Prerequisites

Ensure you have access to AWS and Google Cloud accounts for the respective services. 

### Installation

1. Clone the Repository:
   ```bash
   git clone https://github.com/yourusername/DalVacationHome.git
   cd DalVacationHome
