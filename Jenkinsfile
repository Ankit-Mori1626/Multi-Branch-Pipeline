pipeline {
    agent none
    environment {
        APP_NAME = "multi-branch-app"
        IMAGE_NAME = "multibranchapp"
        PROD_PORT = "3000"
        DEV_PORT = "3001"
    }

    stages {
        // 1. Checkout aur Changes Dikhana
        stage('Checkout & Show Changes') {
            // FIX: Agar main branch hai toh 'prod' agent, nahi toh 'dev' agent use hoga
            agent {
                label (env.BRANCH_NAME == 'main' ? 'prod' : 'dev')
            }
            steps {
                echo "=== Pulling code for branch: ${env.BRANCH_NAME} ==="
                checkout scm
                
                echo "--- Latest Commit Details ---"
                sh 'git log -1 --stat'
                
                echo "--- Modified Files ---"
                sh 'git diff-tree --no-commit-id --name-only -r HEAD'
            }
        }

        // 2. Dependencies Install karna aur Testing
        stage('Install & Test') {
            // FIX: Dynamic agent routing takki sahi environment tools milein
            agent {
                label (env.BRANCH_NAME == 'main' ? 'prod' : 'dev')
            }
            steps {
                echo "Installing packages and running tests..."
                sh 'npm install'
                sh 'npm test'
            }
        }

        // 3. Docker Build
        stage('Docker Build') {
            // FIX: Taki docker image usi server par build ho jahan use deploy hona hai
            agent {
                label (env.BRANCH_NAME == 'main' ? 'prod' : 'dev')
            }
            steps {
                echo "Building Docker Image for ${env.BRANCH_NAME}..."
                sh "docker build -t ${env.IMAGE_NAME}:${env.BRANCH_NAME} ."
            }
        }

        // 4. Deploy to Staging (Develop Branch)
        stage('Deploy to Staging (Develop Branch)') {
            when { branch 'develop' }
            agent { label 'dev' }
            steps {
                echo "🚀 Deploying ${env.APP_NAME} to Staging Server..."
                sh "docker rm -f app-dev-container || true"
                sh "docker run -d -p ${env.DEV_PORT}:${env.DEV_PORT} -e PORT=${env.DEV_PORT} -e BRANCH_NAME=${env.BRANCH_NAME} --name app-dev-container ${env.IMAGE_NAME}:${env.BRANCH_NAME}"
                echo "Notifying QA team for UAT testing."
            }
        }

        // 5. Deploy to Production (Main Branch)
        stage('Deploy to Production (Main Branch)') {
            when { branch 'main' }
            agent { label 'prod' }
            steps {
                echo "🚨 ALERT: Deploying ${env.APP_NAME} to LIVE PRODUCTION..."
                sh "docker rm -f app-prod-container || true"
                sh "docker run -d -p ${env.PROD_PORT}:${env.PROD_PORT} -e PORT=${env.PROD_PORT} -e BRANCH_NAME=${env.BRANCH_NAME} --name app-prod-container ${env.IMAGE_NAME}:${env.BRANCH_NAME}"
                echo "Deployment successfully live on production port 3000!"
            }
        }
    }  
}
